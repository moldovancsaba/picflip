declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveStyleRule(property: string, value: any): R;
    }
  }
}
