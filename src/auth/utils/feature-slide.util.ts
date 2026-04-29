/**
 * Wrap the slide index to the range of the slide count
 * This is used to ensure that the slide index is always within the range of the slide count
 * For example, if the slide count is 3 and the index is 4, the wrapped index will be 1
 *
 * @param index - The index of the slide
 * @param slideCount - The number of slides
 * @returns The wrapped index
 */
export function wrapSlideIndex(index: number, slideCount: number) {
  return ((index % slideCount) + slideCount) % slideCount
}
