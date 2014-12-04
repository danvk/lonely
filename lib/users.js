/**
 * A fake set of users for lonely hangouts.
 */
'use strict';
var assert  = require('assert');

var numUsers = 0;  // number of users seen so far

/**
 * Returns a { id: id#, displayName: "User Name", ... } object
 * whose ID is not the same as any of existing_users.
 */
function makeUpUser(existingUsers) {
  var ids = {};
  for (var i = 0; i < existingUsers.length; i++) {
    ids[existingUsers[i].person.id] = true;
  }

  var user = null;
  for (var i = 0; i < FAKE_USERS.length; i++) {
    if (ids[FAKE_USERS[i].id]) continue;
    user = FAKE_USERS[i];
    break;
  }
  assert.ok(user);

  var displayIndex = numUsers;
  numUsers++;
  return {
    id: 'x' + user.id,  // per-hangout id
    displayIndex: displayIndex,
    hasAppEnabled: true,
    hasMicrophone: false,
    hasCamera: false,
    person: user
  };
}


var PHOTO_URLS = [
  // Letter D, from https://ssl.gstatic.com/bt/C3341AA7A1A076756462EE2E5CD71C11/avatars/avatar_tile_d_56.png
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACcklEQVRoQ+1Xa28SQRQ9uwsLlMcWUIuxL20xmjTG/jh/iv9HPxkTm9ZG06o0LTWmQIBlaRdY2Id3x1abiHzYmYKbzE14hHBnzrnn3p0zyutXewFiHIoksGD1pAILFgBSAakAZwVkC3EWkDtdKsBdQs4FuBVQFEBR6W1GBEGAwOdE+o90bgLFByk82s5D09SpW7iuj6veGFbbgW1NMJkQE4H2kZtA+WEa1ZclJPTpBG5YuQS81xqhUbcZGRJFSAglEII0CaQ7/tMvqSUNOUOHntYYYNsa4+zIgtl0/j8CI9vFl70Ohlfub3BaQkUml8Da0zyMe2n2e/i/T+/a7JM3hCowJEBH79sYXP4NrFDS8XhnGfmizjA3z2182zd58fObudszMItAiHS1mscavbSkirDd9t804Qw8LhJzUyBEGaqw9WIZWZoJ3wtQOzTROh/Eh0Amq6G6W0KhnGIE6sd9/KhdxpNA4AdoUPVPPvLNwVxb6LYCksB14y1MAZ9aqEmn8slhL0YzQAdadbdIT6NfQ3z6uYeLUzs+BIoraTzZMehkTsIjk3f8oUuWYhQPAlpCwfqzAiqbOXKuCrMRB29b7EDjibnMgEJG9f7qEjaeG0hdm7o6GbrvX/nOgJD4nRMolHWUKhlU1rNkIRQodAPqXAzJ9HXZHPCGUAKzwLBbGeG1Og5qBya3B7rZ684JhI9Lj/rcGXnoNuhCc2ZjTN9FBTeBnJHEykYWKg3mtPDcgN0P+l0Hg/5E2E1MmAKiKhl1HW4Fom4sKk8SEFXJqOtIBaJWTlSeVEBUJaOuIxWIWjlReVIBUZWMuo5UIGrlROXFXoGf5NLhYDDboEsAAAAASUVORK5CYII=",
  // Letter G, from https://ssl.gstatic.com/bt/C3341AA7A1A076756462EE2E5CD71C11/avatars/avatar_tile_g_56.png
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADGUlEQVRoQ+1XS2sTYRQ982jTJH03lb6LXfnYdFeKCNWFigpCxT/nD3Cj6MadBZ+gQl3Ux8ZFkdY29hGTtvaRNjPjuTMGCiaFcr/SFL5LJgSSmdxzzzn33s+593Y3whkOxwI4ZfYsA6dMACwDlgFlBayElAVU324ZUJdQ+QDjDDhMyOOby0s+S4S8Im5cAS/Ti5dRAO0+MJp1McZrKOOghUgiZr5xAOT3Qsxvh1jaibBVUZb90O3GAAynHUz0eDGAehGQih87Id4XAqzsmeHCCIARVvv6OR89qUQ06+UIS7shivtJkn0tDgbSLtqbku/lu2c/KyiLtpShBpBiwe8P+ehnghLLTO7NWoACQVA1cWS9RFqTZKizOQHxejXAbDFQpk+fac8Dl9pdVt9DinrfrkR4ycS+b4X/mVWMfTXnYbzLi02eJ9BHC3ozqAHc7vdxoU2qH2GRBn1MadSLi/zdJEFkafYyi/9wnu5WhgqAdJ1bBDCccdkiI3wsJAatF83E2eY74CturWuUmTZUALpoypt9HgYJoBJGmFkJ8G3TgDOPgcoCOIqBjiZgvJMtqEaI5D6XQmwqfXyiDAyw/z8YplFqxAHl/3Sxgl9KH5wogH4CmOaMqIbsR2Jg13GwT888IYC8ciIbBfCKM2Buo76JZWJf48TOcWI3BIAM5X2HbXSEUzakpr8y+RfsRPWi4QBIolO9Ml1dyChbpZ6fL1dQqjOfGhKAbKF3B3xkKO4D6nqOneUDh1mtRe181sEUJdTNfaghJCQMSOVvcJhd7vDiQ0uZIGSYzf4O8Odfi5T1rTcFXMn5XOoc7kINBEBAyIowPSgbqRN3mGrIZiqnsC5WvFXaDyM5mUX4VAzxbr0BttFqsmkaeqLbw1iry2SBJumZh0JMvsd8SxwAYvYvR3SrY2wS+nX68J/JmjxIFka5G8neL8xIUFU8RkbxQWeBG6scdPRrXPJs1Rw4qlKSvBx2qgC29Wqp+XcnBuA4MtD81gLQVM/EvZYBE1XUPMMyoKmeiXstAyaqqHmGZUBTPRP3WgZMVFHzjDPPwF9nb9PAFdkpZQAAAABJRU5ErkJggg==",
  // Letter R, from https://ssl.gstatic.com/bt/C3341AA7A1A076756462EE2E5CD71C11/avatars/avatar_tile_r_56.png
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACl0lEQVRoQ+1Ya08aQRQ9u8vyFEEEZIuPVtv+3v6Ifu7faNKkTUyrNb5CQS1SHwVcHgvs9s5Yi8aAytxgSeYmm8AyM3vPPXfOmcV49/5DgBkOQwN4ZvY0A89MADQDmgHFCugWUiyg8nTNgHIJFRdgYcAwAMMwx6YSBAHExR0sAPKZNIr57Mjc/MCH2+6gcdWiy0XH67HhYAHg5DJ4u7b8YFK+76PhtlD+WcNl4+rB8Y8ZwA6g43moN10MBoO/zzcQDocwn4gjbNvyXqvdxU6pjKbbfkyOY8ewAxCVPagco+v1/z3YskwJYNXJYy4ek/drF7/x/bD8/wG4qDex++OIANztc7HRX74ooLiUhWWa8Hp9fNzcnh0AItPcQgrryw6ikbBssc3dQ+U2Ym+hUQwIAEuLC3hVLCASttHr9/F5e+8eU0+lZGoA7JBFyTsEIg2TWui83sC3vdJT8703nh1Ak2SyUv0lK3wdBiKkPqlkAtn0PGw7hHbXw9Z+SXqDarADGJDW92iDku8OVci0ELIs+h5I/S9Xa9LUOIIdwLikxFGiTk68Xz5hqb7kl+NvldtO3KK2EBrfv2Vkc/EoMilqH9oHBump+O0LbWDRSqrBDmCUCiXJyDZWHGloAsTp2SW5cUU1f34GxsmocOKVQk7uB8HCp687tNlvjhyTYZkaAyK9RVKhDTKyWDQym0aWJil9vVpEIhbVAG4abqotdJcBH1sHJeX3gqkCEK3zZq0olUh4wtHpGUonVfo82QZm8wFxTCjQQU2EOB5USSKHPjBMTsink80gmbh+JxA+cEwghHtPGiwMTPpwjnkaAEcVVdbQDKhUj2OuZoCjiipraAZUqscxVzPAUUWVNTQDKtXjmKsZ4Kiiyhp/AIde33AfxtPiAAAAAElFTkSuQmCC",
  // Letter K, from https://ssl.gstatic.com/bt/C3341AA7A1A076756462EE2E5CD71C11/avatars/avatar_tile_k_56.png
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAC80lEQVRoQ+1XaU8TURQ90522tpXFgoJRcCEalMT4wSV81MT/4b/yrxijQSWAxiWgUMsqFrvTbTp0OuN9DzGyhrx5UzR5tx87980599x37xnt2exTG/9xaIrAKaunFDhlAaAUUAo4rIBqIYcFdJyuFHBcQocHSFFAgwea5vkNxYZlt4+E5dG89J/25/+dZ8XtmBQCycgILsRucFAVI4e1rY/YbusHSEQC3RiKjSHsj3HIjVYZq+UPaJpVYR2kEDh/ZhTXeh9wEEX9OxZykzDa9T2gAt4uXErcQTI6Aq/HB8OsI1WYQr6xIgyeJXaEgFfzcYWG4mPwe0PUYiZS+Sls1lKkhPXvE+juGsRo3wSYCixWSu+xVv5E0I++Kydl5boCAW8Yt/ofI0r9zyJXX6HWeXPoHTkp6L+fc5UAm07jA08QDyVh2zbKzU18K7xFvVUSwXpojmsEWpZBl3YcFxO3OXjdrCBdmEZBX3c0NvezcIXAYv41r/rVnnvweYIwrW0+Ljcq88fuCBFZpBNomjWU9QxioXPo8rF5byNTXcBy6R0RMUQwHpsjncD+t7UtE19zr5BrLEsH78oe2I+S9X+VtvNc9jktt4Z0EtIVYFZifeszIv6zGIzfpDsQ4H2fqS4iXZzmS0xmSCewayVaVhPXeyfIOgxzvMw6LJVmka0tOd6+HdsDQVpiY8lHiAZ7+DtrRgHp0gxK+g9po9Q1BXbNXDyYJCUeIhxIcBLlZgZfsi8PmD3RtnKdAPP+fZHL5Fbvw087wbYtbifmcy9EMe/J6wABkH0O8K3M3CgLdqnTxRlabHOOSXSEAEMZ9if4Zk6EBujrTQPbD4v5Sfyspx2R6BgBhpLZ6uHuu3zEsmBfZAtEomJkhUlIIcCq2h+9sjNpyGluVlOH2gbmTpP0XJxshkY/i+5DUd9AobHKLYdISCEg8mJZOYqArEqKnqMUEK2crDylgKxKip6jFBCtnKw8pYCsSoqeoxQQrZysPKWArEqKnvML34j0gKE3AeQAAAAASUVORK5CYII=",
  // Letter J, from https://ssl.gstatic.com/bt/C3341AA7A1A076756462EE2E5CD71C11/avatars/avatar_tile_j_56.png
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAB+ElEQVRoQ+2XzS8DURTFz7Q6o6XUVxGUBZEKsRAisbGwtLDzP/l/rCwkEqsuREREpENE05ZQtFNmzIf3RkiIyEvmzSi5bzKLJm9u7jm/M537lM2dLQ9/eCkk4JfpEYFfBgAiQAQCOkARCmhg4MeJQGALAxaIjEBciUFhF1+O58Jjl4wViQAtlsBc7ziyyYzf8+GdjpJxJ6P/aD5k7fEElrPTmEgP+k3vlY+h1yskgDsQSYSIwA9hIwIibyJFiCIkkpMf9lCEKEL/PUJdiRRiytuk+ey8sNv6JLnl34HV4Vkk2zQ4roviYxnFL4NaMq5iZSiP0Y7+1hzmNsaXkdE6/Dn/9L6Ews3Zp3m/T0tjbWTeF2m7DrYvC6hZRsBgvj0uZZRYGpjCTE8OnuehaZs4uNVxXq/6gni8Vgbz7CzQDYXFrNKsYbd8BJNFTcaSIiDFnF0fW2QOq36TfNWtJxj2M4ZSPf5vLs5ybexXT3DZuJHRuzwCvFK2vRsL/ZN+lNRY24cQ3jgn8WA1cfpwBf2xCttzWk8A7yidSCLXOYBetRMaO4VxGrz5e9PAReMaNbMh7Sz87oCUCH21kx/gOQX+12ozAbLy/h22UARIy4dAIRIgYFKoW4hAqPYKFCcCAiaFuoUIhGqvQHEiIGBSqFuIQKj2ChT/8wReAcXFT1C4b4ynAAAAAElFTkSuQmCC",
  // Letter A, from https://ssl.gstatic.com/bt/C3341AA7A1A076756462EE2E5CD71C11/avatars/avatar_tile_a_56.png
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADg0lEQVRoQ+1XWU8TURT+Zrp3pra4REUFQY0bEhcEcYkL1i2uEeKTxkR/lE8++qAmaBQjEIEgEoOoKCqiQUEJuNs6pe200xnPXBITk2rIzCWUZE7ShyZz7/2+8333nHOF4fMNBmZxCA6BGVbPUWCGBYCjgKOAzQw4FrKZQNvLHQVsp9DmBtOngCgCogsQCKFB45am2YSaf/m0EfCvq4BvzXoILhdyCQUTXR3QFYU7iWkhIEoyQnUH4SlZDkEQoKdSSHS1Q339anYQ8JatgLRzD9yRIgbY0HWkX/Uj0dkG5HJcSfBXQBAh1e5EYONmso/7D9jsp3Eo7S3Iffta2ATEOWHIe/bDV1rGgObI965QCHo6zRRQB/naiLsCnqUlCO07AFc4Ai0WQ6qvFyEiZEay7zGSPd0wVJWbCnwJuN0IbqmGVL2dAZx49BCp/j7MO3sBgseDSRu1ko2+FCYBUabqEz0CL6lgUN2PNV6FRmDDR0/Bu6wUeiaDxL1mqENvJnsDh+CqgHtxMcLHTkP0+ZAdH0O8qRFGWoW/YgPZKMrgpp4/RaK7E8hmOcCnPsntUU+dN1hVA6lmx6R9yOvJ3h66xRpc8xcgcrweoiTRpf6F2LUr0CcShUXA9HjkzDm4i4pYxVFa7iAz8o6BFIMS5L1R+MpXknMMKKaNBl4UFgEPeTxysoGBynwcoc7bgdzPH+y/QDNRoHIjgrW7WGdW3w7i191bhUVArjuEAM0/ZmhfvyD7efyvAc5FXdkkac5GRjaD75cvwaBLbTe43AGBLu3csxchBgJTxqO0tSL98tmUv//Xh1wIeFeuRvjwMXaGTk1KT07kPc+sToI/QJYSmc3iN64VBoHwiXp4afI0aFBT37ymjtubF5hnUTGCm7eyLm0Sjd9uhDY2aouEbQXcCxZS7T9FJVKmsTmJxH0amwcH8itAc1Jo/2F4lyxlZJNPepB8+GBmCQQqN9H0uQugMmpWnfjN69DpAfOvkHfXwb++kl1m7fs3/KSeALrUVsOeAgR6TpQyWr6KjQZmeVRamv6LxXwrmCqIfj9y1MyUtmZkh99bxW+vE4tyCP61FeTpMHu0ZN4Psd//QqBKFazaxsYNg8YJdegtsqMfZoaA5VM5LrRnIY5ArG7lELCaOV7rHAV4ZdLqPo4CVjPHa52jAK9MWt3HUcBq5nitcxTglUmr"
];

var FAKE_USERS = [
    { id: 1234, displayName: 'Dan Vanderkam', image: { url: PHOTO_URLS[0] } },
    { id: 2345, displayName: 'Rocky Gulliver', image: { url: PHOTO_URLS[1] } },
    { id: 3456, displayName: 'Raven Keller', image: { url: PHOTO_URLS[2] } },
    { id: 4567, displayName: 'Kenny Leftin', image: { url: PHOTO_URLS[3] } },
    { id: 5678, displayName: 'Jossie Ivanov', image: { url: PHOTO_URLS[4] } },
    { id: 6789, displayName: 'Alastair Tse', image: { url: PHOTO_URLS[5] } }
    // TODO(danvk): add more
  ];


module.exports = {
  makeUpUser: makeUpUser
};
