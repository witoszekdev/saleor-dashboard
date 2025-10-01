import { Handler, NoopValuesHandler } from "../../API/Handler";
import { BaseMappableQueryVarsBuilder } from "./BaseMappableQueryVarsBuilder";
import { FilterElement } from "../../FilterElement/FilterElement";

/** `staffMemberStatus` needs to be renamed to `status` in query */
export class StaffMemberStatusQueryVarsBuilder extends BaseMappableQueryVarsBuilder {
  protected readonly queryField = "status";

  canHandle(element: FilterElement): boolean {
    return element.value.value === "staffMemberStatus";
  }

  createOptionFetcher(): Handler {
    return new NoopValuesHandler([]);
  }

  protected getQueryFieldName(_element: FilterElement): string {
    return this.queryField;
  }
}
