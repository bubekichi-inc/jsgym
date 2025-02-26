import { useReward } from "react-rewards";

export const useRewardApprove = () => {
  const config = {
    startVelocity: 50,
    elementCount: 150,
    elementSize: 15,
  };

  const { reward: rewardRight } = useReward("rewardRight", "confetti", config);
  const { reward: rewardLeft } = useReward("rewardLeft", "confetti", config);

  const reward = () => {
    rewardRight();
    rewardLeft();
  };

  return { reward };
};
