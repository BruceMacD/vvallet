export const waitUntilTrue = async (checkFunc: () => Promise<boolean>) => {
  while (true) {
    let done = await checkFunc()
    if (done) {
      return
    }
    await sleep(3000)
  }
}

export const sleep = (ms: number): Promise<NodeJS.Timeout> => { return new Promise(res => setTimeout(res, ms)); }
