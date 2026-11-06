<template>
    <footer class="app-site-footer" :class="`app-site-footer--${variant}`">
        <div class="app-site-footer__top">
            <div class="app-site-footer__inner">
                <ul v-if="links.length" class="app-site-footer__links">
                    <li v-for="link in links" :key="link.label" class="app-site-footer__link-item">
                        <RouterLink class="app-site-footer__link" :class="{ 'is-strong': link.strong }" :to="link.to ?? '#'">
                            {{ link.label }}
                        </RouterLink>
                    </li>
                </ul>

                <ul v-if="sns.length" class="app-site-footer__sns">
                    <li v-for="item in sns" :key="item.type">
                        <AppIconButton :href="item.href" new-tab :size="28" :icon-size="20" :aria-label="snsLabels[item.type]">
                            <component :is="snsIcons[item.type]" />
                        </AppIconButton>
                    </li>
                </ul>
            </div>
        </div>

        <div class="app-site-footer__body">
            <div class="app-site-footer__inner">
                <div class="app-site-footer__company">
                    <strong class="app-site-footer__title">{{ title }}</strong>
                    <ul v-if="infos.length" class="app-site-footer__infos">
                        <li v-for="info in infos" :key="info">{{ info }}</li>
                    </ul>
                    <p v-if="copyright" class="app-site-footer__copyright">{{ copyright }}</p>
                </div>

                <div class="app-site-footer__cs">
                    <div v-if="tel" class="app-site-footer__tel">
                        <a class="app-site-footer__tel-number" :href="`tel:${tel}`">{{ tel }}</a>
                        <span v-if="hours" class="app-site-footer__hours">{{ hours }}</span>
                    </div>
                    <div v-if="$slots.actions" class="app-site-footer__actions">
                        <slot name="actions" />
                    </div>
                    <slot name="extra" />
                </div>
            </div>
        </div>
    </footer>
</template>

<script setup>
import { IconFacebook, IconInstagram, IconKakao, IconX, IconYoutube } from '@/components/icons';
import AppIconButton from '@/components/AppButton/AppIconButton.vue';

/**
 * AppSiteFooter (Figma 19. Footer Guide - 기본 Footer / 샘플 4번 블랙 타입)
 * 상단 76px(정책 링크 / SNS) + 본문(회사 정보 / 고객센터)
 * 고객센터 버튼은 #actions, APP 다운로드·QR 등 추가 영역은 #extra 슬롯을 사용합니다.
 */
defineProps({
    title: { type: String, required: true },
    /** strong: 개인정보처리방침처럼 강조할 링크 */
    links: { type: Array, default: () => [] },
    sns: { type: Array, default: () => [] },
    /** 대표자 / 주소 / 사업자 정보 등 한 줄씩 */
    infos: { type: Array, default: () => [] },
    copyright: { type: String, default: '' },
    tel: { type: String, default: '' },
    hours: { type: String, default: '' },
    /** light(흰 배경) / dark(블랙 배경) */
    variant: { type: String, default: 'light' },
});

const snsIcons = { instagram: IconInstagram, facebook: IconFacebook, youtube: IconYoutube, kakao: IconKakao, x: IconX };
const snsLabels = {
    instagram: '인스타그램 (새 창)',
    facebook: '페이스북 (새 창)',
    youtube: '유튜브 (새 창)',
    kakao: '카카오톡 채널 (새 창)',
    x: 'X (새 창)',
};
</script>
