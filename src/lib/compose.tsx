/* eslint-disable react/display-name */
import type { ComponentType, ReactNode } from "react";

const compose = (providers: ComponentType<{ children: ReactNode }>[]) =>
  providers.reduce((Prev, Curr) => ({ children }: { children: ReactNode }) => (
    <Prev>
      <Curr>{children}</Curr>
    </Prev>
  ));
export default compose;
