import {
  Action,
  ActionCreatorsMapObject,
  AnyAction,
  Dispatch,
  Middleware,
  MiddlewareAPI,
} from "redux";

export const BATCH = "BATCHING_REDUCER.BATCH";

export type State = any;

export interface BatchMiddleware<
  S = any,
  D extends Dispatch = Dispatch,
  E = any
> {
  (extraArgs: E): (
    api: MiddlewareAPI<D, S>
  ) => (next: Dispatch<AnyAction>) => (action: any) => any;
}

export interface BatchAction {
  type: typeof BATCH;
  meta: {
    batch: true;
  };
  payload: AnyAction[];
}

export interface ThunkDispatch<
  TState,
  TExtraThunkArg,
  TBasicAction extends Action | Action[] | ThunkAction | ThunkAction[]
> {
  <TReturnType>(
    thunkAction: ThunkAction<TReturnType, TState, TExtraThunkArg, TBasicAction>
  ): TReturnType;
  <A extends TBasicAction>(action: A): A;
  // This overload is the union of the two above (see TS issue #14107).
  <TReturnType, TAction extends TBasicAction>(
    action:
      | TAction
      | ThunkAction<TReturnType, TState, TExtraThunkArg, TBasicAction>
      | TAction[]
      | ThunkAction<TReturnType, TState, TExtraThunkArg, TBasicAction>[]
  ): TAction | TReturnType;
}

export type ThunkAction<
  TReturnType = any,
  TState = any,
  TExtraThunkArg = any,
  TBasicAction extends Action | Action[] | ThunkAction | ThunkAction[] = any
> = (
  dispatch: ThunkDispatch<TState, TExtraThunkArg, TBasicAction>,
  getState: () => TState,
  extraArgument: TExtraThunkArg
) => TReturnType;

declare module "redux" {
  function bindActionCreators<
    TActionCreators extends ActionCreatorsMapObject<any>
  >(
    actionCreators: TActionCreators,
    dispatch: Dispatch
  ): {
    [TActionCreatorName in keyof TActionCreators]: ReturnType<
      TActionCreators[TActionCreatorName]
    > extends ThunkAction
      ? (
          ...args: Parameters<TActionCreators[TActionCreatorName]>
        ) => ReturnType<ReturnType<TActionCreators[TActionCreatorName]>>
      : TActionCreators[TActionCreatorName];
  };

  interface Dispatch<A extends Action = AnyAction> {
    <TReturnType = any, TState = any, TExtraThunkArg = any>(
      thunkAction: ThunkAction<TReturnType, TState, TExtraThunkArg, A>
    ): TReturnType;
  }

  interface Dispatch<A extends Action = AnyAction> {
    <TReturnType = any, TState = any, TExtraThunkArg = any>(
      thunkAction: ThunkAction<TReturnType, TState, TExtraThunkArg, A>[]
    ): TReturnType;
  }

  interface Dispatch<A extends Action = AnyAction> {
    <TReturnType = any>(thunkAction: A[]): TReturnType;
  }
}
