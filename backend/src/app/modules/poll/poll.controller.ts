import type { Request, RequestHandler, Response } from "express";
import asyncHandler from "../../common/middlewares/asyncHandler.js";
import { db } from "../../../db/index.js";
import { polls } from "../../../db/schema/poll.schema.js";
import { ApiResponse } from "../../common/utils/apiResponce.js";
import type {
  addQuestionDtoType,
  createPollDtoType,
  submiteVoteDtoType,
} from "./poll.validation.js";
import { and, count, desc, eq, or } from "drizzle-orm";
import ApiError from "../../common/utils/apiError.js";
import { questions } from "../../../db/schema/question.schema.js";
import { options } from "../../../db/schema/options.schema.js";
import { votes } from "../../../db/schema/votes.schema.js";
import { viwes } from "../../../db/schema/viwes.schema.js";
import { saves } from "../../../db/schema/saves.schema.js";

interface optionType {
  questionId: string;
  text: string;
  orderIndex: number;
}

interface dashboardoptionsType {
  id: string;
  text: string;
}

interface dashboardquestiondataType {
  id: string;
  text: string;
  isRequired: boolean;
  options: dashboardoptionsType[];
}

interface PollOption {
  id: string;
  text: string;
  orderIndex: number;
  voteCount: number;
}

interface PollQuestion {
  id: string;
  text: string;
  isRequired: boolean;
  orderIndex: number;
  options: PollOption[];
}

type ResultVisibility = "always" | "after_vote" | "creator_only";

interface PollData {
  id: string;
  title: string;
  description: string | null;
  isPublic: boolean;
  resultVisibility: ResultVisibility;
  questions: PollQuestion[];
  isClosed: boolean;
  closedAt?: string | null;
  totalVotes: number;
}

class pollController {
  static createPoll: RequestHandler = asyncHandler(
    async (req: Request, res: Response) => {
      const { userId } = (req as any).userId;
      if (!userId) throw new Error("User ID not found in request");
      const { title, description, isPublic, closedAt } =
        req.body as createPollDtoType;
      const [newPoll] = await db
        .insert(polls)
        .values({
          title,
          description,
          isPublic,
          closedAt: closedAt ? new Date(closedAt) : null,
          creatorId: userId,
        })
        .returning();
      return ApiResponse(res, 201, "Poll created successfully", { ...newPoll });
    },
  );
  static getCreatedPolls: RequestHandler = asyncHandler(
    async (req: Request, res: Response) => {
      const { userId } = (req as any).userId;
      if (!userId) throw new Error("User ID not found in request");
      const userPolls = await db
        .select()
        .from(polls)
        .where(eq(polls.creatorId, userId))
        .orderBy(desc(polls.createdAt));
      return ApiResponse(res, 200, "User polls retrieved successfully", {
        polls: userPolls,
      });
    },
  );
  static getPollData: RequestHandler = asyncHandler(
    async (req: Request, res: Response) => {
      const { pollId } = req.params;
      if (!pollId) {
        throw ApiError.badRequest("pollId is missing");
      }

      const [poll] = await db
        .select()
        .from(polls)
        .where(eq(polls.id, pollId as string));
      if (!poll) {
        throw ApiError.notFound("poll not found");
      }
      return ApiResponse(res, 200, "poll data fetch sucessfully", { ...poll });
    },
  );
  static publishPoll: RequestHandler = asyncHandler(
    async (req: Request, res: Response) => {
      try {
        const { pollId, questionsData } = req.body as addQuestionDtoType;
        const { userId } = (req as any).userId;
        if (!userId) throw new Error("User ID not found in request");
        const [poll] = await db
          .select()
          .from(polls)
          .where(eq(polls.id, pollId as string));
        if (!poll) {
          throw ApiError.notFound("poll not found");
        }
        if (poll.creatorId !== userId) {
          throw ApiError.forbidden("you don't access to this poll");
        }
        const writtenQuestionData = await db
          .insert(questions)
          .values(
            questionsData.map((q) => {
              const eachQuestion = {
                pollId,
                text: q.text,
                orderIndex: q.orderIndex,
                isRequired: q.isRequired || false,
              };
              return eachQuestion;
            }),
          )
          .returning();

        if (writtenQuestionData.length === 0) {
          throw ApiError.internal("problem to insert questions");
        }
        const optionsData: optionType[] = [];

        questionsData.forEach((q, qi) => {
          const questionId = writtenQuestionData[qi]?.id;
          if (!questionId)
            throw ApiError.internal("Question ID missing after insert");

          q.options.forEach((o, oi) => {
            optionsData.push({
              questionId,
              text: o.text,
              orderIndex: o.orderIndex,
            });
          });
        });
        if (optionsData.length === 0) {
          throw ApiError.badRequest("options are empty");
        }
        await db.insert(options).values(optionsData);
        await db
          .update(polls)
          .set({
            status: "active",
          })
          .where(eq(polls.id, pollId));

        return ApiResponse(res, 200, "poll is published");
      } catch (error) {
        throw ApiError.internal();
      }
    },
  );
  static deletePoll: RequestHandler = asyncHandler(
    async (req: Request, res: Response) => {
      const { pollId } = req.params;

      if (!pollId) {
        throw ApiError.badRequest("pollId is missing");
      }
      const { userId } = (req as any).userId;
      if (!userId) throw new Error("User ID not found in request");
      const [poll] = await db
        .select()
        .from(polls)
        .where(eq(polls.id, pollId as string));
      if (!poll) {
        throw ApiError.notFound("poll not found");
      }
      if (poll.creatorId !== userId) {
        throw ApiError.forbidden("you don't access to this poll");
      }
      await db.delete(polls).where(eq(polls.id, pollId as string));
      return ApiResponse(res, 200, "poll is deleted");
    },
  );
  static getDashboardPolldata: RequestHandler = asyncHandler(
    async (req: Request, res: Response) => {
      try {
        const { pollId } = req.params;

        if (!pollId) {
          throw ApiError.badRequest("pollId is missing");
        }
        const { userId } = (req as any).userId;
        if (!userId) throw new Error("User ID not found in request");
        const [poll] = await db
          .select()
          .from(polls)
          .where(eq(polls.id, pollId as string));
        if (!poll) {
          throw ApiError.notFound("poll not found");
        }
        if (poll.creatorId !== userId) {
          throw ApiError.forbidden("you don't access to this poll");
        }
        const questionWiseVoteData = await db
          .select()
          .from(questions)
          .innerJoin(options, eq(options.questionId, questions.id))
          .leftJoin(votes, eq(votes.optionId, options.id))
          .where(eq(questions.pollId, poll.id));

        const totalViwes = await db
          .select({ count: count() })
          .from(viwes)
          .where(eq(viwes.pollId, poll.id));

        const totalQuestions = await db
          .select()
          .from(questions)
          .where(eq(questions.pollId, pollId as string));

        const questionWiseOptionsMap = new Map<
          string,
          dashboardquestiondataType
        >();
        const optionWiseVoteCountMap = new Map<string, number>();

        for (const vote of questionWiseVoteData) {
          const { questions, options } = vote;
          const voteId = vote.votes?.id;
          const questionId = questions.id;
          const optionId = options.id;

          if (!questionWiseOptionsMap.has(questionId)) {
            questionWiseOptionsMap.set(questionId, {
              id: questionId,
              text: questions.text,
              isRequired: questions.isRequired,
              options: [],
            });
          }

          const question = questionWiseOptionsMap.get(questionId)!;

          const optionExists = question.options.some((o) => o.id === optionId);

          if (!optionExists) {
            question.options.push({
              id: optionId,
              text: options.text,
            });
          }
          optionWiseVoteCountMap.set(
            optionId,
            (optionWiseVoteCountMap.get(optionId) || 0) + (voteId ? 1 : 0),
          );
        }
        let totalVotes = 0;
        const questionData = [...questionWiseOptionsMap.values()].map((q) => ({
          ...q,
          options: q.options.map((op) => {
            totalVotes += optionWiseVoteCountMap.get(op.id) || 0;
            return {
              id: op.id,
              text: op.text,
              votes: optionWiseVoteCountMap.get(op.id) || 0,
            };
          }),
        }));
        const polldata = {
          ...poll,
          totalViews: totalViwes[0]?.count || 0,
          totalVotes,
          totalQuestions: totalQuestions.length,
          totalOptions: optionWiseVoteCountMap.size,
        };
        return ApiResponse(res, 200, "poll details fetching", {
          polldata,
          questionData,
        });
      } catch (error) {
        throw ApiError.internal();
      }
    },
  );
  static getInterfaceData: RequestHandler = asyncHandler(
    async (req: Request, res: Response) => {
      try {
        const { pollId } = req.params;

        if (!pollId) {
          throw ApiError.badRequest("pollId is missing");
        }

        const pollData = await db
          .select()
          .from(polls)
          .innerJoin(questions, eq(questions.pollId, polls.id))
          .innerJoin(options, eq(options.questionId, questions.id))
          .leftJoin(votes, eq(votes.optionId, options.id))
          .where(eq(polls.id, pollId as string));

        if (pollData.length === 0) {
          throw ApiError.notFound("poll not found");
        }

        const pollDataMap = new Map<string, PollData>();
        const questionDataMap = new Map<string, PollQuestion>();
        const optionDataMap = new Map<string, PollOption>();

        for (const eachRow of pollData) {
          const rowPollId = eachRow.polls.id;
          const rowQuestionId = eachRow.questions.id;
          const rowOptionId = eachRow.options.id;

          let poll = pollDataMap.get(rowPollId);

          if (!poll) {
            poll = {
              id: rowPollId,
              title: eachRow.polls.title,
              description: eachRow.polls.description,
              isPublic: eachRow.polls.isPublic,
              resultVisibility: eachRow.polls.resultVisibility,
              questions: [],
              isClosed: eachRow.polls.closedAt
                ? eachRow.polls.closedAt > new Date()
                : false,
              closedAt: eachRow.polls.closedAt
                ? eachRow.polls.closedAt.toISOString()
                : null,
              totalVotes: 0,
            };

            pollDataMap.set(rowPollId, poll);
          }

          let question = questionDataMap.get(rowQuestionId);

          if (!question) {
            question = {
              id: rowQuestionId,
              text: eachRow.questions.text,
              isRequired: eachRow.questions.isRequired,
              orderIndex: eachRow.questions.orderIndex,
              options: [],
            };

            questionDataMap.set(rowQuestionId, question);

            poll.questions.push(question);
          }

          let option = optionDataMap.get(rowOptionId);

          if (!option) {
            option = {
              id: rowOptionId,
              text: eachRow.options.text,
              orderIndex: eachRow.options.orderIndex,
              voteCount: 0,
            };

            optionDataMap.set(rowOptionId, option);
            question.options.push(option);
          }

          if (eachRow.votes) {
            poll.totalVotes++;
            option.voteCount++;
          }
        }

        const result = pollDataMap.get(pollId as string);

        return ApiResponse(res, 200, "poll data fetch successfully", {
          ...result,
        });
      } catch (error) {
        throw ApiError.internal("problem to fetch polldata");
      }
    },
  );
  static submitVote: RequestHandler = asyncHandler(
    async (req: Request, res: Response) => {
      try {
        const user = (req as any).userId;
        const userId = user?.userId;
        const { guestToken } = req.cookies;

        if (!userId && !guestToken) {
          throw ApiError.unAuthorized();
        }

        const { answers } = req.body as submiteVoteDtoType;
        if (answers.length === 0) {
          throw ApiError.badRequest();
        }
        const inserData = answers.map((a) => {
          return {
            questionId: a.questionId,
            optionId: a.optionId,
            userId: userId ? userId.toString() : null,
            guestToken: guestToken ? guestToken.toString() : null,
          };
        });

        const alreadyVoted = await db
          .select()
          .from(votes)
          .where(
            or(
              and(
                eq(votes.questionId, answers[0]?.questionId as string),
                eq(votes.userId, userId),
              ),
              and(
                eq(votes.questionId, answers[0]?.questionId as string),
                eq(votes.guestToken, guestToken),
              ),
            ),
          );

        if (alreadyVoted.length > 0) {
          throw ApiError.conflict("user already voted");
        }
        await db.insert(votes).values(inserData);

        return ApiResponse(res, 201, "vote submited successfully");
      } catch (error) {
        console.log(error);
      }
    },
  );
  static viewPoll: RequestHandler = asyncHandler(
    async (req: Request, res: Response) => {
      try {
        const { pollId } = req.params;

        if (!pollId) {
          throw ApiError.badRequest("pollId is missing");
        }
        const user = (req as any).userId;
        const userId = user?.userId;
        const { guestToken } = req.cookies;

        if (!userId && !guestToken) {
          throw ApiError.unAuthorized();
        }

        await db.insert(viwes).values({
          pollId: pollId as string,
          userId: userId as string,
          guestToken,
        });
        return ApiResponse(res, 201, "view vote successfully");
      } catch (error) {
        console.log(error);
      }
    },
  );
  static alreadyVoted: RequestHandler = asyncHandler(
    async (req: Request, res: Response) => {
      try {
        const user = (req as any).userId;
        const userId = user?.userId;
        const { guestToken } = req.cookies;
        const { pollId } = req.params;

        if (!pollId) {
          throw ApiError.badRequest("pollId is missing");
        }
        if (!userId && !guestToken) {
          throw ApiError.unAuthorized();
        }

        const alreadyVoted = await db
          .select()
          .from(polls)
          .innerJoin(questions, eq(questions.pollId, polls.id))
          .innerJoin(
            votes,
            and(
              or(eq(votes.userId, userId), eq(votes.guestToken, guestToken)),
              eq(votes.questionId, questions.id),
            ),
          )
          .where(eq(polls.id, pollId as string));

        return ApiResponse(res, 201, "vote submited successfully", {
          alreadyVoted: alreadyVoted.length > 0,
        });
      } catch (error) {
        throw ApiError.internal();
      }
    },
  );
  static savePoll: RequestHandler = asyncHandler(
    async (req: Request, res: Response) => {
      try {
        const { userId } = (req as any).userId;
        const { pollId } = req.params;

        if (!pollId) {
          throw ApiError.badRequest("pollId is missing");
        }

        const alreadySaved = await db
          .select()
          .from(saves)
          .where(
            and(eq(saves.userId, userId), eq(saves.pollId, pollId as string)),
          );
        if (alreadySaved.length > 0) {
          await db
            .delete(saves)
            .where(
              and(eq(saves.userId, userId), eq(saves.pollId, pollId as string)),
            );
          return ApiResponse(res, 200, "poll unsaved sucessfully");
        }
        await db.insert(saves).values({
          pollId: pollId as string,
          userId: userId,
        });
        return ApiResponse(res, 200, "poll saved sucessfully");
      } catch (error) {
        throw ApiError.internal("problem to save the poll");
      }
    },
  );
  static isPollSaved: RequestHandler = asyncHandler(
    async (req: Request, res: Response) => {
      try {
        const userId = (req as any).userId;
        
        if(!userId){
          return ApiResponse(res, 200, "user is unauthorized", {
            isSaved: false
          })
        }
        const { pollId } = req.params;

        if (!pollId) {
          throw ApiError.badRequest("pollId is missing");
        }
        const alreadySaved = await db
          .select()
          .from(saves)
          .where(
            and(eq(saves.userId, userId), eq(saves.pollId, pollId as string)),
          ).limit(1);
        
        return ApiResponse(res, 200, "poll saved data fetch successfully", {
          isSaved: alreadySaved.length > 0
        });
      } catch (error) {
        throw ApiError.internal("problem to save the poll");
      }
    },
  );
}
export default pollController;
