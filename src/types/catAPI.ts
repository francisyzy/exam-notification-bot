interface catAPI {
  breeds: [Object];
  id: string;
  url: string;
  width: number;
  height: number;
}

interface catAPIs extends Array<catAPI> {}

export { catAPIs };
