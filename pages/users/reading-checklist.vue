<template>
  <section class="dashboard">
    <nav class="navbar navbar-dark bg-dark flex-md-nowrap p-0 shadow">
      <a class="navbar-brand col-sm-3 col-md-2 mr-0" href="#">{{ $t('appName') }}</a>
      <!-- <input class="form-control form-control-dark w-100" type="text" placeholder="Search" aria-label="Search"> -->
      <ul class="navbar-nav px-3">
        <li class="nav-item text-nowrap">
          <a class="nav-link" href="#" @click="logout()">Log out</a>
        </li>
      </ul>
    </nav>
    <div class="container-fluid">
      <div class="row">
        <nav class="col-md-2 d-none d-md-block bg-light sidebar">
          <div class="sidebar-sticky">
            <ul class="nav flex-column">
              <li class="nav-item">
                <a class="nav-link active" href="#">
                  <home-icon/>
                  Dashboard <span class="sr-only">(current)</span>
                </a>
              </li>
            </ul>
          </div>
        </nav>

        <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4">
          <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 class="h2">Reading checklist</h1>
            <div class="btn-toolbar mb-2 mb-md-0">
              <div class="btn-group mr-2">
                <button type="button" :class="['btn', 'btn-sm', view.oldTestament ? 'btn-primary' : 'btn-outline-primary']" @click="toggleView('oldTestament')">Old Testament</button>
                <button type="button" :class="['btn', 'btn-sm', view.newTestament ? 'btn-primary' : 'btn-outline-primary']" @click="toggleView('newTestament')">New Testament</button>
              </div>
            </div>
          </div>

          <div v-for="(bookgroup, index) in ['oldTestament', 'newTestament']" :key="index">
            <div v-if="view[bookgroup]">
              <div v-for="(totalChapters, bookCode, index) in bible[bookgroup]" :key="index">
                <h2><a class="badge badge-primary" :href="'#' + bookCode" :name="bookCode">{{ $t('bible.'+ bookgroup + '.' + bookCode + '.name') }}</a></h2>
                <button type="button" :class="['btn', 'mx-1 my-1', bookCode in checkList && checkList[bookCode].includes(chapter) ? 'btn-primary' : 'btn-dark']" v-for="chapter in totalChapters" :key="chapter" @click="mark(bookCode, chapter, bookCode in checkList && checkList[bookCode].includes(chapter))">
                  {{ chapter }}
                  <span class="badge badge-light"></span>
                  <span class="sr-only"></span>
                </button>
                <hr>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </section>
</template>

<script>
import { HomeIcon } from "vue-feather-icons";
import { arrayUnion, arrayRemove } from "vuex-easy-firestore";
import { auth } from "~/services/firebase";
import { CHECKLIST_UPDATE } from "~/lib/nuxt-event";

export default {
  components: {
    HomeIcon
  },
  data() {
    return {
      view: {
        oldTestament: true,
        newTestament: true,
      },
      bible: {
        oldTestament: {
          "gen": 50,
          "exo": 40,
          "lev": 27,
          "num": 36,
          "deu": 34,
          "jos": 24,
          "jdg": 21,
          "rut": 4,
          "1sa": 31,
          "2sa": 24,
          "1ki": 22,
          "2ki": 25,
          "1ch": 29,
          "2ch": 36,
          "ezr": 10,
          "neh": 13,
          "est": 10,
          "job": 42,
          "psa": 150,
          "pro": 31,
          "ecc": 12,
          "sng": 8,
          "isa": 66,
          "jer": 52,
          "lam": 5,
          "ezk": 48,
          "dan": 12,
          "hos": 14,
          "jol": 3,
          "amo": 9,
          "oba": 1,
          "jon": 4,
          "mic": 7,
          "nam": 3,
          "hab": 3,
          "zep": 3,
          "hag": 2,
          "zec": 14,
          "mal": 4,
        },
        newTestament: {
          "mat": 28,
          "mrk": 16,
          "luk": 24,
          "jhn": 21,
          "act": 28,
          "rom": 16,
          "1co": 16,
          "2co": 13,
          "gal": 6,
          "eph": 6,
          "php": 4,
          "col": 4,
          "1th": 5,
          "2th": 3,
          "1ti": 6,
          "2ti": 4,
          "tit": 3,
          "phm": 1,
          "heb": 13,
          "jas": 5,
          "1pe": 5,
          "2pe": 3,
          "1jn": 5,
          "2jn": 1,
          "3jn": 1,
          "jud": 1,
          "rev": 22,
        },
      },
      checkList: {},
      user: null
    };
  },
  created() {
    this.user = auth.currentUser;
    this.initChecklistEvent();
    this.$nuxt.$on(CHECKLIST_UPDATE, data => {
      this.checkList = data;
    });
  },
  beforeDestroy() {
    this.$nuxt.$off(CHECKLIST_UPDATE);
  },
  methods: {
    toggleView(group) {
      if (group === "oldTestament" || group === "newTestament") {
        this.view[group] = !this.view[group];
      }
    },
    mark(bookCode, chapter, currentValue) {
      if (this.user) {
        this.$store.dispatch("userReadingChecklist/mark", { user: this.user, bookCode: bookCode, chapter: chapter, value: !currentValue });
      }
    },
    initChecklistEvent() {
      if (this.user) {
        this.$store.dispatch("userReadingChecklist/subscribeChecklist", this.user);
      }
    },
    logout() {
      this.$store.dispatch("userLogout")
        .then(() => {
          this.$router.push({ path: "/" });
        });
    }
  }
};
</script>
<style>
body {
  font-size: .875rem;
}

.feather {
  width: 16px;
  height: 16px;
  vertical-align: text-bottom;
}

/*
 * Sidebar
 */

.sidebar {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: -1; /* Behind the navbar */
  padding: 48px 0 0; /* Height of navbar */
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, .1);
}

.sidebar-sticky {
  position: relative;
  top: 0;
  height: calc(100vh - 48px);
  padding-top: .5rem;
  overflow-x: hidden;
  overflow-y: auto; /* Scrollable contents if viewport is shorter than content. */
}

@supports ((position: -webkit-sticky) or (position: sticky)) {
  .sidebar-sticky {
    position: -webkit-sticky;
    position: sticky;
  }
}

.sidebar .nav-link {
  font-weight: 500;
  color: #333;
}

.sidebar .nav-link .feather {
  margin-right: 4px;
  color: #999;
}

.sidebar .nav-link.active {
  color: #007bff;
}

.sidebar .nav-link:hover .feather,
.sidebar .nav-link.active .feather {
  color: inherit;
}

.sidebar-heading {
  font-size: .75rem;
  text-transform: uppercase;
}

/*
 * Content
 */

[role="main"] {
  padding-top: 133px; /* Space for fixed navbar */
}

@media (min-width: 768px) {
  [role="main"] {
    padding-top: 48px; /* Space for fixed navbar */
  }
}

/*
 * Navbar
 */

.navbar-brand {
  padding-top: .75rem;
  padding-bottom: .75rem;
  font-size: 1rem;
  background-color: rgba(0, 0, 0, .25);
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, .25);
}

.navbar .form-control {
  padding: .75rem 1rem;
  border-width: 0;
  border-radius: 0;
}

.form-control-dark {
  color: #fff;
  background-color: rgba(255, 255, 255, .1);
  border-color: rgba(255, 255, 255, .1);
}

.form-control-dark:focus {
  border-color: transparent;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, .25);
}
</style>

