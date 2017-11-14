/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

declare module "*.peg" {
  interface Parser
  {
      parse(input: string): { data: any[], text: any[] };
  }

  const _: Parser;
  export default _;
}
