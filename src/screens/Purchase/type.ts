import { TransactionRequest } from "../../interface/transaction";

export type StepComponentProps = {
  onMoveStep: (isNext: boolean, _?: any) => void,
  data: TransactionRequest
};
