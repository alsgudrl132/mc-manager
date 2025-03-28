import { Router } from "express";
import * as playerController from "../controllers/playerController";
import { verifyToken, isModerator } from "../middleware/authMiddleware";

const router = Router();

// 모든 인증된 사용자가 접근 가능한 라우트
router.get("/", verifyToken, playerController.getPlayerList);
router.get("/:uuid/history", verifyToken, playerController.getPlayerHistory);

// 모더레이터 이상만 접근 가능한 라우트
router.post(
  "/:playerName/kick",
  verifyToken,
  isModerator,
  playerController.kickPlayer
);
router.post(
  "/:playerName/ban",
  verifyToken,
  isModerator,
  playerController.banPlayer
);
router.post(
  "/:playerName/unban",
  verifyToken,
  isModerator,
  playerController.unbanPlayer
);
router.post(
  "/:playerName/op",
  verifyToken,
  isModerator,
  playerController.opPlayer
);
router.post(
  "/:playerName/deop",
  verifyToken,
  isModerator,
  playerController.deopPlayer
);
router.post(
  "/:playerName/teleport",
  verifyToken,
  isModerator,
  playerController.teleportPlayer
);
router.post(
  "/:playerName/gamemode",
  verifyToken,
  isModerator,
  playerController.setGamemode
);
router.post(
  "/:playerName/give",
  verifyToken,
  isModerator,
  playerController.giveItem
);

export default router;
