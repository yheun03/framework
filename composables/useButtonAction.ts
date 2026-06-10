/**
 * 버튼 클릭 액션과 라우팅/이벤트 처리를 관리하는 composable 파일입니다.
 */
import { computed, resolveComponent } from "vue";

type ButtonActionOptions = {
  attrs: Record<string, unknown>;
  type: () => string;
  to: () => string | undefined;
  href: () => string | undefined;
  newTab: () => boolean;
  disabled: () => boolean;
  onClick: (event: MouseEvent) => void;
};

export function useButtonAction(options: ButtonActionOptions) {
  const NuxtLinkComp = resolveComponent("NuxtLink");
  const isLink = computed(() => !!options.to() || !!options.href());

  const tag = computed(() => {
    if (options.to()) return NuxtLinkComp;
    if (options.href()) return "a";
    return "button";
  });

  const componentAttrs = computed(() => {
    const { class: _class, style: _style, ...passthroughAttrs } = options.attrs;

    if (options.to()) {
      return {
        to: options.to(),
        ...passthroughAttrs,
      };
    }

    if (options.href()) {
      return {
        href: options.href(),
        target: options.newTab() ? "_blank" : undefined,
        rel: options.newTab() ? "noopener noreferrer" : undefined,
        ...passthroughAttrs,
      };
    }

    return {
      type: options.type(),
      disabled: options.disabled(),
      ...passthroughAttrs,
    };
  });

  const ariaDisabled = computed(() => {
    if (!isLink.value) return undefined;
    return options.disabled() ? "true" : undefined;
  });

  const tabIndex = computed(() => {
    if (isLink.value && options.disabled()) return -1;
    return undefined;
  });

  function handleClick(event: MouseEvent) {
    if (options.disabled()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    options.onClick(event);
  }

  return {
    tag,
    componentAttrs,
    ariaDisabled,
    tabIndex,
    handleClick,
  };
}
