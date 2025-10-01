import { UrlEntry } from "./UrlToken";
import { FilterContainer } from "../FilterElement/FilterElement";

type Structure = Array<string | UrlEntry | Structure>;

export const prepareStructure = (filterValue: FilterContainer): Structure =>
  filterValue.map(f => {
    if (typeof f === "string") {
      return f;
    }

    if (Array.isArray(f)) {
      return prepareStructure(f);
    }

    return f.asUrlEntry();
  });
