<template>
    <div id="app">
        <div class="layout-top">
            <h1>Hantering av mina fakturor</h1>
        </div>
        <div id="navigate" class="layout-sidebar">
            <ul>
                <li>
                    <router-link to="/invoice">Fakturera</router-link>
                </li>
                <li>
                    <router-link to="/invoices">Mina fakturor</router-link>
                </li>
            </ul>
        </div>
        <div id="main" class="layout-main">
            <router-view></router-view>
        </div>
    </div>

</template>