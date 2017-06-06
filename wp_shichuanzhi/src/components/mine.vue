<script>
    //es6
    export default {
        //data: function(){}，下面是es6写法
        data () {
            return {
                name:"师传志"
            }
        }
    }
</script>

<template>
    <div>
        <h1>姓名：{{name}}</h1>
    </div>
</template>