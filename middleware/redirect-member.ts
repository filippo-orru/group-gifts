console.log("test middleware");
export default defineNuxtRouteMiddleware((to, from) => {
    console.log("path", to.path);
    const match = to.path.match(/\/groups\/(.+?)\/members\/(.+?)\/?$/);
    if (match) {
        return navigateTo(`/groups/${match[1]}/members/${match[2]}/gifts`);
    }
});