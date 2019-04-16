export default function(context) {
  if (context.store.getters.user != null) {
    context.redirect('/')
  }
}
