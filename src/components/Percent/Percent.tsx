import { formatPercantage } from "./utils";
import { LocaleConsumer } from "../Locale/Locale";

interface PercentProps {
  amount: number;
}

const Percent = ({ amount }: PercentProps) => (
  <LocaleConsumer>{({ locale }) => formatPercantage(amount, locale)}</LocaleConsumer>
);

Percent.displayName = "Percent";
export { Percent };
