export function section<Props extends object, Result>(
  Component: (props: Props) => Result,
  props: NoInfer<Props>,
) {
  // The component and its checked props stay paired when rendered in a loop.
  return { Component: Component as (props: object) => Result, props };
}
