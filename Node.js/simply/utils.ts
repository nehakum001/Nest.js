export function getAverage(numbers: number[]): number | null {
  if (numbers.length > 0) {
    return +(numbers.reduce((a, b) => a + b, 0) / numbers.length).toFixed(2);
  }
  return null;
}

export function mergeArrays(isPureResult, resultArray) {
  const result = resultArray.map((item) => {
    const { materialId, batchId, plantId } = item.dataValues;
    const isPureItem = Array.isArray(isPureResult)
      ? isPureResult.find(
        (pureItem) =>
          pureItem.MATERIALID === materialId
            && pureItem.BATCHID === batchId
            && pureItem.PLANTID === plantId,
      )
      : null;

    return {
      ...item.dataValues,
      isPure: isPureItem ? isPureItem.ISPURE : null,
    };
  });
  return result;
}
