import { ErrorToast } from "../components";

const toastConfig = {
    errorToast: ({ props }) => (
        <ErrorToast props={props} />
    )
};

export { toastConfig };