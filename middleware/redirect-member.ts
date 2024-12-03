export default defineNuxtRouteMiddleware((to, from) => {
    const match = to.path.match(/\/groups\/(.+?)\/members\/(.+?)\/?$/);
    if (match) {
        return navigateTo(`/groups/${match[1]}/members/${match[2]}/gifts`);
    }
});