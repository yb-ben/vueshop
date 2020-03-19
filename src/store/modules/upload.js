
const state= {

    imageUpload: false

},


const mutations = {

    OPEN_(state){
        state.imageUpload = true;
    },

    CLOSE_(state){
        state.imageUpload = false;
    }
},

const actions = {

    open(context){
        context.commit('open');
    },

}


export default {
    namespaced: true,
    state,
    mutations,
    actions
  }
  
  