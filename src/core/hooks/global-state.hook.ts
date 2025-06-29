import { useDispatch, useSelector } from 'react-redux'

import type { AppDispatch, RootState } from '../store'

/**
 * Hook to get the dispatch function
 * Use it in place of useDispatch
 *
 * @returns The dispatch function
 * @example
 * ```ts
 * const dispatch = useAppDispatch()
 * dispatch(setUser(user))
 * ```
 */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()

/**
 * Hook to get the selector function
 * Use it in place of useSelector
 *
 * @returns The selector function
 * @example
 * ```ts
 * const user = useAppSelector(state => state.user)
 * ```
 */
export const useAppSelector = useSelector.withTypes<RootState>()
