import { z } from "zod";
import BaseDto from "../../common/validation/baseDto.js";
import { title } from "node:process";

export class createPollDto extends BaseDto {
  static baseSchema = z.object({
    title: z.string().trim().max(500),
    description: z.string().trim().max(1000).optional(),
    isPublic: z.boolean().default(true),
    closedAt: z.string().datetime().optional(),
  });
}

export class addQuestionsDto extends BaseDto {
  static baseSchema = z.object({
    pollId: z.string().uuid({ message: 'Invalid poll ID' }),
    questionsData: z
      .array(
        z.object({
          text: z.string().min(1, { message: 'Question text is required' }).max(1000),
          orderIndex: z.number().int().nonnegative(),
          isRequired: z.boolean().default(false),
          options: z
            .array(
              z.object({
                text: z.string().min(1, { message: 'Option text is required' }).max(1000),
                orderIndex: z.number().int().nonnegative(),
              })
            )
            .min(2, { message: 'Each question must have at least 2 options' })
            .max(10, { message: 'Maximum 10 options per question' }),
        })
      )
      .min(1, { message: 'At least one question is required' })
      .max(20, { message: 'Maximum 20 questions per poll' }),
  })
}

export class submiteVoteDto extends BaseDto {
  static baseSchema = z.object({
    answers: z.array(
      z.object({
        questionId: z.uuid(),
        optionId: z.uuid(),
      })
    )
  })
}

export type submiteVoteDtoType = z.infer<typeof submiteVoteDto.baseSchema>
export type addQuestionDtoType = z.infer<typeof addQuestionsDto.baseSchema>

export type createPollDtoType = z.infer<typeof createPollDto.baseSchema>;
