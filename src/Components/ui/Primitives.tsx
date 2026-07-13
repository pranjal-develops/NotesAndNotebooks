import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

const cn = (...classes: Array<string | false | null | undefined>) => {
  return classes.filter(Boolean).join(' ');
};

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    'bg-violet-600 text-white shadow-lg shadow-violet-600/20 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-400',
  secondary:
    'bg-white/90 text-slate-700 ring-1 ring-slate-200/80 hover:bg-slate-50 dark:bg-slate-900/80 dark:text-slate-100 dark:ring-slate-700/80 dark:hover:bg-slate-800',
  ghost:
    'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white',
  danger:
    'bg-rose-500 text-white shadow-lg shadow-rose-500/20 hover:bg-rose-600 dark:bg-rose-500 dark:hover:bg-rose-400',
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-5 text-sm font-semibold',
  icon: 'h-10 w-10',
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export const Button = ({
  className,
  variant = 'primary',
  size = 'md',
  type = 'button',
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition motion-safe:duration-200 motion-safe:ease-out motion-safe:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950',
        buttonVariants[variant],
        buttonSizes[size],
        className,
      )}
      {...props}
    />
  );
};

export const IconButton = ({
  className,
  variant = 'secondary',
  size = 'icon',
  ...props
}: ButtonProps) => {
  return <Button className={className} variant={variant} size={size} {...props} />;
};

type CardProps = HTMLAttributes<HTMLDivElement> & {
  glow?: boolean;
};

export const Card = ({ className, glow = false, ...props }: CardProps) => {
  return (
    <div
      // className={cn(
      //   'rounded-[28px] border border-white/70 bg-white/85 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.28)] backdrop-blur dark:border-slate-800/80 dark:bg-slate-950/70 dark:shadow-[0_24px_70px_-36px_rgba(0,0,0,0.7)]',
      //   glow && 'ring-1 ring-violet-200/70 dark:ring-violet-500/20',
      //   className,
      // )}
      className={cn(
        'rounded-[28px] border border-white/70 bg-white/85 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.28)] backdrop-blur dark:border-zinc-800/80 dark:bg-zinc-950/70 dark:shadow-[0_24px_70px_-36px_rgba(0,0,0,0.7)]',
        glow && 'ring-1 ring-violet-200/70 dark:ring-violet-500/20',
        className,
      )}
      {...props}
    />
  );
};

export const SectionCard = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return <Card className={cn('rounded-3xl p-4 sm:p-5', className)} {...props} />;
};

export const Surface = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200/80 bg-white/90 text-slate-900 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-100',
        className,
      )}
      {...props}
    />
  );
};

export const Input = ({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      // className={cn(
      //   'h-11 w-full rounded-2xl border border-slate-200 bg-white/90 px-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100 dark:placeholder:text-slate-500',
      //   className,
      // )}
      className={cn(
        'h-11 w-full rounded-2xl border border-zinc-200 bg-white/90 px-4 text-sm text-zinc-900 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 dark:border-zinc-700 dark:bg-zinc-950/60 dark:text-zinc-100 dark:placeholder:text-zinc-500',
        className,
      )}
      {...props}
    />
  );
};

export const Textarea = ({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  return (
    <textarea
      className={cn(
        'min-h-28 w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100 dark:placeholder:text-slate-500',
        className,
      )}
      {...props}
    />
  );
};

type FieldProps = HTMLAttributes<HTMLDivElement> & {
  label: string;
  hint?: string;
};

export const Field = ({ label, hint, className, children, ...props }: FieldProps) => {
  return (
    <div className={cn('space-y-2', className)} {...props}>
      <div className="space-y-1">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          {label}
        </label>
        {hint && <p className="text-sm text-slate-500 dark:text-slate-400">{hint}</p>}
      </div>
      {children}
    </div>
  );
};

export const Skeleton = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      // className={cn(
      //   'animate-pulse rounded-2xl bg-slate-200/80 dark:bg-slate-800/80',
      //   className,
      // )}
      className={cn(
        'animate-pulse rounded-2xl bg-zinc-200/80 dark:bg-zinc-800/80',
        className,
      )}
      {...props}
    />
  );
};
