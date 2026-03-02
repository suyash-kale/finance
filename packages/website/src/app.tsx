import { Route, Routes } from "react-router";
import { BrowserRouter } from "react-router";

import { LayoutPublic } from "@/components/layout/public";
import { SignIn } from "@/pages/sign-in";
import { SignUp } from "@/pages/sign-up";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LayoutPublic />}>
          <Route path="/" element={<SignIn />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
