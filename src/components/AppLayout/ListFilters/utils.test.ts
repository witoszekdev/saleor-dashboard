import { getSelectedFilterAmount } from "./utils";
import { FilterElement, IFilter } from "../../Filter/types";

describe("getSelectedFilterAmount", () => {
  it("should return 0 when no selected filters", () => {
    // Arrange
    const menu = [{ name: "test1" }, { name: "test2" }] as IFilter<string>;
    const data = [
      { name: "test1", active: false },
      { name: "test2", active: false },
    ] as Array<FilterElement<string>>;
    // Act
    const result = getSelectedFilterAmount(menu, data);

    // Assert
    expect(result).toBe(0);
  });
  it("should return amount of selected filters", () => {
    // Arrange
    const menu = [{ name: "test1" }, { name: "test2" }, { name: "test3" }] as IFilter<string>;
    const data = [
      { name: "test1", active: true },
      { name: "test2", active: false },
      { name: "test3", active: true },
    ] as Array<FilterElement<string>>;
    // Act
    const result = getSelectedFilterAmount(menu, data);

    // Assert
    expect(result).toBe(2);
  });
});
