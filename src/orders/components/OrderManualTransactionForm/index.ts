import { ReactElement } from "react";
import {
  OrderManualTransactionForm as MainComponent,
  OrderManualTransactionFormProps as MainComponentProps,
} from "./OrderManualTransactionForm";
import { DescriptionField } from "./components/DescriptionField";
import { ErrorText } from "./components/ErrorText";
import { Form } from "./components/Form";
import { PriceInputField } from "./components/PriceInputField";
import { PspReferenceField } from "./components/PspReferenceField";
import { SubmitButton } from "./components/SubmitButton";

interface OrderManualTransactionCombinedComponent {
  (props: OrderManualTransactionFormProps): ReactElement | null;
  DescriptionField: typeof DescriptionField;
  ErrorText: typeof ErrorText;
  Form: typeof Form;
  PriceInputField: typeof PriceInputField;
  SubmitButton: typeof SubmitButton;
  PspReferenceField: typeof PspReferenceField;
}

export const OrderManualTransactionForm = MainComponent as OrderManualTransactionCombinedComponent;
OrderManualTransactionForm.DescriptionField = DescriptionField;
OrderManualTransactionForm.ErrorText = ErrorText;
OrderManualTransactionForm.Form = Form;
OrderManualTransactionForm.PriceInputField = PriceInputField;
OrderManualTransactionForm.SubmitButton = SubmitButton;
OrderManualTransactionForm.PspReferenceField = PspReferenceField;

export type OrderManualTransactionFormProps = MainComponentProps;
