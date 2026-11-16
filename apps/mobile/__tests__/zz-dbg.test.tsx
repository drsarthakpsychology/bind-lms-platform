import { act, screen } from "@testing-library/react-native";
import * as React from "react";
import { session } from "@/auth";
import { mock } from "@/api/mock/server";
import { render } from "./utils";
it("dbg", async () => {
  await session.boot(); await session.signIn("ananya@example.com","pw"); await session.choosePin("2580");
  const S = require("../app/(student)/home").default;
  await render(<S />);
  for (let i=0;i<6;i++) await act(async()=>{await new Promise(r=>setTimeout(r,0));});
  console.log(screen.queryAllByText(/./).slice(0,15).map(n=>n.props.children), mock.log().slice(-5));
});
