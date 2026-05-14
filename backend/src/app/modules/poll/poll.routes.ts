import { Router } from "express";
import pollController from "./poll.controller.js";
import { authorization, optionalAuthorization } from "../auth/auth.middleware.js";
import { validate } from "../../common/middlewares/validate.js";
import { addQuestionsDto, createPollDto, submiteVoteDto } from "./poll.validation.js";
import { isAuthorizationRequired } from "./poll.middleware.js";

const pollRouter: Router = Router();

pollRouter.post(
  "/create",
  authorization,
  validate(createPollDto),
  pollController.createPoll,
);
pollRouter.get("/createdpolls", authorization, pollController.getCreatedPolls);
pollRouter.get("/polldata/:pollId", authorization, pollController.getPollData);
pollRouter.post("/publishpoll", authorization, validate(addQuestionsDto), pollController.publishPoll)
pollRouter.delete("/deletepoll/:pollId", authorization, pollController.deletePoll)
pollRouter.get("/dashboard/:pollId", authorization, pollController.getDashboardPolldata)
pollRouter.get("/interface/:pollId", isAuthorizationRequired, pollController.getInterfaceData)
pollRouter.post("/submit-vote/:pollId", isAuthorizationRequired, validate(submiteVoteDto), pollController.submitVote)
pollRouter.post("/viwe-poll/:pollId", isAuthorizationRequired, pollController.viewPoll)
pollRouter.get("/is-already-voted/:pollId", isAuthorizationRequired, pollController.alreadyVoted)
pollRouter.post("/save-poll/:pollId", authorization, pollController.savePoll);
pollRouter.get("/isSaved/:pollId",optionalAuthorization, pollController.isPollSaved)
export default pollRouter;
