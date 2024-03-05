'use client';

export const updateSelection = (selected: string[], id: string): string[] => {
  if (!selected.includes(id)) {
    return [...selected, id];
  }
  return selected.filter((s) => s !== id);
};

export const checkIfAllSelected = (
  data: any[],
  selected: string[],
  objectKey = 'id'
) => {
  const allItemIds = data.map((item) => item[objectKey]);
  const isEveryOneSelected = allItemIds.every((id) => selected.includes(id));
  return isEveryOneSelected;
};

export const updateAllSelections = (
  data: any[],
  selected: string[],
  isAllSelected: boolean,
  objectKey = 'id'
): string[] => {
  const allItemIds = data.map((item) => item[objectKey]);
  if (isAllSelected) {
    const filtered = selected.filter((id) => !allItemIds.includes(id));
    return filtered;
  }
  return [...selected, ...allItemIds];
};
