<template>
  <nav class="navbar navbar-light">
    <div class="container">
      <a class="navbar-brand" href="/">conduit</a>
      <ul class="nav navbar-nav pull-xs-right">
        <li class="nav-item">
          <!-- Add "active" class when you're on that page" -->
          <nuxt-link class="nav-link" active-class="active" exact to="/">Home</nuxt-link>
        </li>
        <li class="nav-item">
          <nuxt-link class="nav-link" active-class="active" to="/editor">
            <i class="ion-compose"></i>&nbsp;New Post
          </nuxt-link>
        </li>
        <li class="nav-item">
          <nuxt-link class="nav-link" active-class="active" to="/settings">
            <i class="ion-gear-a"></i>&nbsp;Settings
          </nuxt-link>
        </li>
        <li class="nav-item">
          <nuxt-link class="nav-link" active-class="active" to="/register">Sign up</nuxt-link>
        </li>
      </ul>
    </div>
  </nav>
</template>