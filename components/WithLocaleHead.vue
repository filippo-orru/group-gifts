<script lang="ts" setup>
const head = useLocaleHead();
</script>

<template>
  <div>
    <Html :lang="head.htmlAttrs?.lang" :dir="head.htmlAttrs?.dir">

    <Head>
      <template v-for="link in head.link" :key="link.id">
        <Link :id="link.id" :rel="link.rel" :href="link.href" :hreflang="link.hreflang" />
      </template>
      <template v-for="meta in head.meta" :key="meta.id">
        <Meta :id="meta.id" :property="meta.property" :content="meta.content" />
      </template>
    </Head>

    <Body>
      <slot />
    </Body>

    </Html>
  </div>
</template>


<style></style>