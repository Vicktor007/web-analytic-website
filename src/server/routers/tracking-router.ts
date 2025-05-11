import { router } from "../__internals/router";


const handleError = (c: { json: (arg0: { success: boolean; error: any }, arg1: number) => any }, message: any, status = 500) => {
  return c.json({ success: false, error: message }, status);
};

export const trackingRouter = router({

})