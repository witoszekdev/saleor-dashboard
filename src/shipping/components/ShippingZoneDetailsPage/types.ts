import { Option } from "@saleor/macaw-ui-next";
import { MetadataFormData } from "../../../components/Metadata/types";

export interface ShippingZoneUpdateFormData extends MetadataFormData {
  name: string;
  description: string;
  warehouses: Option[];
  channels: Option[];
}
