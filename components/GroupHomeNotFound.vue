<template>
  <div>
    <NavBar :title="`Groups`" />
    <GenericPanel>
      <div class="h-[60vh] flex flex-col items-center justify-center gap-4">
        <div class="text-center">Group not found</div>
        <NuxtLink to="/groups" class="btn btn-primary">
          <i class="las la-arrow-right"></i>
          Back to groups
        </NuxtLink>
      </div>
    </GenericPanel>
  </div>
</template>