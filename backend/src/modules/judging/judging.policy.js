/**
  judging.policy.js
  Ownership and access logic for judging.
 */

class JudgingPolicy {
  isScoreOwner(score, judgeId) {
    if (!score || !score.judgeId) return false;
    return score.judgeId.toString() === judgeId.toString();
  }

  isAssignedJudge(assignment) {
    // Guard against null — findAssignment() returns null when the record does not exist.
    // Without the null check, accessing 'assignment.assigned' would throw a TypeError
    // and bubble up as a 500 instead of returning a clean 403.
    if (!assignment) return false;
    return !!assignment.assigned;
  }
}

const judgingPolicy = new JudgingPolicy();
export default judgingPolicy;
