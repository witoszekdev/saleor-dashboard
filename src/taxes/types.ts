import { TaxClassRateInput } from "@dashboard/graphql";
import { FormsetData } from "@dashboard/hooks/useFormset";

import { MetadataFormData } from "../components/Metadata/types";

export interface TaxClassesPageFormData extends MetadataFormData {
  id: string;
  updateTaxClassRates: FormsetData<TaxClassRateInput>;
  name?: string;
}
