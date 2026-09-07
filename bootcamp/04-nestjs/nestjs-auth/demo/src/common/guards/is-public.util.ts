import { type ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator.ts';

export function isPublicRoute(
  context: ExecutionContext,
  reflector: Reflector,
): boolean {
  return (
    reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) ?? false
  );
}

/**
 * Only true when @Public() is declared on the handler itself. Used by guards
 * that are attached at method level (e.g. via @UseGuards on a single route),
 * so a controller-wide @Public() can't silently override an explicit,
 * nearer guard.
 */
export function isPublicHandler(
  context: ExecutionContext,
  reflector: Reflector,
): boolean {
  return reflector.get<boolean>(IS_PUBLIC_KEY, context.getHandler()) ?? false;
}
