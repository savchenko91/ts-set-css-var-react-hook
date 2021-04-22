import { AnyAction, Reducer } from "redux";

import {
  BATCH,
  BatchAction,
  BatchMiddleware,
  State,
  ThunkAction,
} from "./type";

export default function batchActions<A extends AnyAction[] = AnyAction[]>(
  actions: A,
  type: BatchAction["type"] = BATCH
): BatchAction {
  return { type, meta: { batch: true }, payload: actions };
}

export function enableBatching<S = State>(
  reduce: Reducer<S, AnyAction>
): Reducer<S, AnyAction> {
  return function batchingReducer(state: State, action: any): State {
    if (action && action.meta && action.meta.batch) {
      return action.payload.reduce(batchingReducer, state);
    }
    return reduce(state, action);
  };
}

export const batchDispatchMiddleware: BatchMiddleware = (extraArguments) => (
  api
) => {
  return (next) => (
    action: ThunkAction<any, any, any, any> | BatchAction | AnyAction
  ) => {
    if (typeof action === "function") {
      return action(api.dispatch, api.getState, extraArguments);
    }

    if (Array.isArray(action)) {
      action = batchActions(action);
    }

    if (action?.meta?.batch) {
      _dispatchChildActions(action);
    }

    return next(action);

    //

    async function _dispatchChildActions(action: any) {
      if (action.meta && action.meta.batch) {
        action.payload.forEach(function (childAction: AnyAction) {
          _dispatchChildActions(childAction);
        });
      } else {
        if (typeof action === "function") {
          api.dispatch(action(api.dispatch, api.getState, extraArguments));
        }

        api.dispatch(action);
      }
    }
  };
};
