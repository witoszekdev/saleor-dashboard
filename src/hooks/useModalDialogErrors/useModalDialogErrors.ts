import { useStateFromProps } from "../useStateFromProps";
import { useModalDialogOpen } from "../useModalDialogOpen/useModalDialogOpen";

function useModalDialogErrors<TError>(errors: TError[], open: boolean): TError[] {
  const [state, setState] = useStateFromProps(errors);

  useModalDialogOpen(open, {
    onClose: () => setState([]),
  });

  return state;
}

export { useModalDialogErrors };
