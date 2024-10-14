import { Course, Thread } from "@/backend";

export interface State {
  threads: Thread[];
  isLoading: boolean;
  courses: Record<string, Course>;
}

export const initialState: () => State = () => ({
  isLoading: false,
  threads: [],
  courses: {},
});

export type ForumAction =
  | { type: "load-threads"; threads: Thread[] }
  | { type: "load-courses"; courses: Record<string, Course> }
  | { type: "set-loading"; isLoading: boolean };

const isNever = (value: never) => value;

export const reducer: React.Reducer<State, ForumAction> = (state, action) => {
  switch (action.type) {
    case "load-threads":
      return { ...state, threads: action.threads, isLoading: false };
    case "set-loading":
      return { ...state, isLoading: action.isLoading };
    case "load-courses":
      return {
        ...state,
        courses: action.courses,
        isLoading: false,
      };
    default:
      return isNever(action);
  }
};
