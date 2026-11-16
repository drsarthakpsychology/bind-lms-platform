import { screen } from "@testing-library/react-native";
import * as React from "react";

import { glue, T } from "@/ds";
import { render } from "./utils";

describe("meta lines never start a line with a dot", () => {
  it("glues the dot to the word before it", () => {
    expect(glue("Ananya · You · 2 answers")).toBe("Ananya · You · 2 answers");
    expect(glue(["Ananya", " · ", "2"])).toEqual(["Ananya", " · ", "2"]);
    expect(glue("No dot here")).toBe("No dot here");
  });
  it("still finds the text by its plain words", async () => {
    await render(
      <T>
        {"Rohan"} · {"3 h ago"}
      </T>,
    );
    expect(screen.getByText("Rohan · 3 h ago")).toBeTruthy();
  });
});
