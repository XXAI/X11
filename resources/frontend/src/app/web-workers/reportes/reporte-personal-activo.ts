export class ReportePersonalActivo{
    getDocumentDefinition(reportData:any) {
        //console.log(data);
        let contadorLineasHorizontalesV = 0;
        let fecha_hoy =  Date.now();

        let datos = {
          pageOrientation: 'landscape',
          pageSize: 'LEGAL',
          /*pageSize: {
            width: 612,
            height: 396
          },*/
          pageMargins: [ 40, 60, 40, 60 ],
          header: {
            margin: [30, 20, 30, 0],
            columns: [
                {
                    image: 'data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAAeAAD/4QNvaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjMtYzAxMSA2Ni4xNDU2NjEsIDIwMTIvMDIvMDYtMTQ6NTY6MjcgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6Rjg3NDE1ODMxREE4RTkxMTlDRkM4RTQ3NThEMzBCNkQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Q0M4NzhGMjYwMjRFMTFFQUE5RkE4MjA0ODM1MTlFOEEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Q0M4NzhGMjUwMjRFMTFFQUE5RkE4MjA0ODM1MTlFOEEiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoyMkRCQzg2RUE4MUYxMUU5QkM3RDgzNkU3QTgwQUIxRSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoyMkRCQzg2RkE4MUYxMUU5QkM3RDgzNkU3QTgwQUIxRSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6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',
                    width: 40
                },
                {
                    margin: [10, 0, 0, 0],
                    text: 'SECRETARÍA DE SALUD\nLISTA DE PERSONAL - ESTATUS',
                    bold: true,
                    fontSize: 12,
                    alignment: 'center'
                },
                {
                  image: 'data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAAeAAD/4QNvaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjMtYzAxMSA2Ni4xNDU2NjEsIDIwMTIvMDIvMDYtMTQ6NTY6MjcgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6Rjg3NDE1ODMxREE4RTkxMTlDRkM4RTQ3NThEMzBCNkQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Q0M4NzhGMjYwMjRFMTFFQUE5RkE4MjA0ODM1MTlFOEEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Q0M4NzhGMjUwMjRFMTFFQUE5RkE4MjA0ODM1MTlFOEEiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoyMkRCQzg2RUE4MUYxMUU5QkM3RDgzNkU3QTgwQUIxRSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoyMkRCQzg2RkE4MUYxMUU5QkM3RDgzNkU3QTgwQUIxRSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pv/uAA5BZG9iZQBkwAAAAAH/2wCEABALCwsMCxAMDBAXDw0PFxsUEBAUGx8XFxcXFx8eFxoaGhoXHh4jJSclIx4vLzMzLy9AQEBAQEBAQEBAQEBAQEABEQ8PERMRFRISFRQRFBEUGhQWFhQaJhoaHBoaJjAjHh4eHiMwKy4nJycuKzU1MDA1NUBAP0BAQEBAQEBAQEBAQP/AABEIAFoA+gMBIgACEQEDEQH/xACfAAEAAQUBAAAAAAAAAAAAAAAAAwEEBQYHAgEBAQEBAQEAAAAAAAAAAAAAAAECAwQFEAACAQMCAwQGBgcFCQAAAAABAgMAEQQhEjFBBVEiEwZhcYGxMhSRQlJyshWh0WIjM5NUwaJjJDXh8cJzgzRkJSYRAAEDAwIFBAEEAwEAAAAAAAEAEQIhMQNBElFhIhMEcYHxBcHwoTIjkbGSJP/aAAwDAQACEQMRAD8A6BSlKIlKjkmjiF3YDmBzsOJt6L1av1Ne8I07yXDBztINmIuvpK8ayZxFytCMjYK+pVgOovexVDtIU2b49xsPD9XOpYs1WxlyJBtDMECjvHcW2W9d+NQZInXmhhIacldUrxHJHIu6Ngy3IuDcXBsa91tZSlKURKUqlEVaVSq0RKUqlEVaVSq0RKUpREpSlESlKURKUpREpSlESlUpRFWlKURUqDKyTCAiKXkcHaBa+g1sDxPo51LJIsaFmIHAC5tcnQD2msbj4/zOQ0kkZCAkyCSxYP8AYup1UcRfhy0rE5GkY3K3CIrI2Cmijly4F8U7ZIyDFOBfeCNTtcDQg2Ne2GHFcbRLKoJCnvN3dbf22q0lklgMxd2SRyY45CLBFvfucjpw9tRgHwzuUoshG23fuF4t9Jtr7q5bgKM51JXXa+tNAFcnLF9pjjVV3CMFSe7bUC3PtFUklxZIvDnX5dEBswNlTldhpbhzqB2I4ra7Kqi9yCNB28ud+FeRJY3B4RggcB3u6O6deAqbzrX1CuwaU91KYpcWzJ8blI4ZhYRqnpH3dT6dav8AFykyUuPiHEdv7QHHaeV6x2Pmqh8KcB8d9GDagX5+rt/31M23CmRSqBUDSPkMSCEPxFvtMf8AbVhICoPTYjgsziTQjquDxWTqlFIZQw4EXF9KV6FwWreZvNE2JO2B08hZU/jTkX2ki+1AdL9pqwxPL3Xeq4qZ0ucV8Ybo1keRjY8CbaC9YrzBBLB1nMSUG7yNIpPNHO5SPdWd8vebMbHxY8HqF0EQ2xzgXXbyDgai3bXGhPVZfbOKWLxoS8WMZyIEpybdIgjRYZuodc6JlyYxyXEkJG5GYyRkEbhYPyINdDw5ZJ8SCaVQkkkau6DgCwBIrD5vl7pXXJ/zFclmDhVJhZSjbfYdbVngAAANANAK3AEPw0Xh8zPiyxx7YiOUD+zp214JXO+tdez8jqOR8vlSx4yuUiSNiq7U7t+72kXrcvMPUPy/pM8ym0rDw4fvvoD7ONa10Hohy/L+fJb97kd3H/6HeFvvPpUm5IA9V08EQxwl5GUAjdHHF+ZqfZX3knqUk6ZOHkSNJKhEqF2LNtbutqewj9NbVXMOhZ/5f1THySbR7tkv3H7rX9XH2V06rA0bgs/ZYe3n3ANHINw9RdYrr+D1XLgQ9MyTjyRFmZASniXGg3DhatEPW+sDjnZAtx/eNXUa5Jki00wHJ3/EazkDF+K9H1ZE4zhKMJCDEExD1d1v/lzB6vAjZHUcwzrOilIixfZzvubnY8qzMqs0bqjbHZSFe19pI0NvRXnH0x4vuL7qlroAwZfMy5DPIZEAF9AwpyXPOrSeYekZIxp+oTPuXfHIsjWZb24Hgau/Lydf6pL446jIkGPIviB3Zi31tu3ha3bXrz4P85iH/Df8Qq+8if6fkn/H/wCBa5AdTVuvrZMn/gGYQx75MH2jiyzHWcLPzcVY8DKOJKrBi4uNwAPduuorR/m/MI6h+WnOmGR4vg/xW27ibceyukVoDj/7QD/y1PurWQVB40Xn+vm8csTGEhDGZh4h3Wz4/TOrR9ImxJc8vmyEmPJ1JjBt3QSbngdfTWm52d5gwMqTEyM2YSxEBtshIIIuCD6RXSq555wFuuy+lI/w0mGAZ+C19dk7macZxhISBn/EXopOn4HmfquP81Bmv4RYqN87qbrx0F6ZU3mvobI+RPJ4bGyuzCaMn7Pe4VsXk4f+ii9LyfiNZDq+Imb0zJx3F98ZK+h1G5T7CKgh0uCXSfmbfIljnjxSxDIYNtqzssd5e8zJ1U/LZCiLMUbgF+CQDiVvwI7Kz1cnwsp8TKgykNmidX9l+8PaNK6tuXt5X9lN5239+S7H6/EPKFP65QlPbziQG9Kq06hdxHEAjXNysl7dgOnHU8OdeY0yI8aOWF1Qbd0iPdr34WYm404CqdWmgiju8Ank2kqDcAKLbu8AddeHOmUfDWMsCMV0CSC9tvYQORqSbdIvYC2jr5cX2xDXJvqopZMrOkEEZ8GPaDIezt9Z+yPaeQqPItDK0I7qxKAig67eRN73vrVLgBjGxllNgtiAHTkzKewcx6uVRh7gKCQVuyhgbg9luI1104cq5kve51/C6ANaw0/KBkKsSNsTi3Mq2umvGwtqBRka+12tqDc82buggcgbaX0oRtI3Elh9Yejn6BUpkjaERS7hv3Msw1KEn4lH1kP6fVWRzV9FA6RgbiGC67rgADvbWuvKx0OvO9XZSSTAVXIaSFwhKg3ABFgVOrctL61BOjw3Y/vIXuysmoKhQGX6CfYKuIGjXCkaUeIjSbCAde7tjvft7taiKyFukupI0ib9QZXeA5bHsbd0lew6H6wBNjVzVn02WOSIhIhEVsCq8OFhb6KvK9EC8RrReeY6josV1Xp/R+rWx8mRBkrcRsjqJVPYBz9RrVuo+TOpYoMmKwy4xrZe7Lb7p0PsPsrH58smH5gnydpWSLKaVQw2kgPuHHkRW3L506KY9zGVWt8BQk/SNP01h4l36SvqiHleNHGcBlmhMOYs4BWlYPUMzpuQJ8VzG4PfQ/C9vqutdNwctM3Dhy0FlmQOAeVxw9lc1m8bq/VZmxIi0mTIzpGOIBPFjwHpNbtkdRxPLPS8XGn3SyhNkaoNHZANx3HQC5pAs/BX7GAydoRj/fO8Rdm19Fg/O2f4+bFgRm6443OBzkfgPYvvrxg+YeuYWLFiQdPBihUKt4pbntJseJrD42eg6qnUM0GUeL40qqRctfcLX7DXR+mdUxOq45yMQsUVtjBhtIYAG36ag6iasVfIbx8OLHLCM0IhzImm8rmeYJTkyPNCcdpSZPCIK2Dm/dDa2roflrP+f6RC7G8sQ8GX7yaX9q2Nat5w6j0/Ny41xyxyMYvFMxG1bA/CL66NeoPLXXo+kTSrkBmxpwN2yxKuvBrEjkdaRIjK9LLp5GOXk+JGQgY5I9QjrwZdFrkmV/Hm++/4jXR87zF07Bw4MuQuyZS7oFVTucWB+ta3HnXNXYOzMTq5J+k3q5CC1dFy+pxzj3JSiQCwD8Q7rrWP/wBvF9xfdUOR1Lp+LIIcnJihkIuEdwpsdL6msBh+d+mJixJPHKsqKFYKFZSQLXB3CtW651Jep9QmzFBWNgFjVrXCqLa29OtU5ABSq8+H6/JPJIZRLHEOd3NZ/wA+IfHwpPqskig+kFT/AG1deQ5FOHlx37yyhiPQygD8NZDrvSG6r0pIo7DJiCyQ30BIFipP7QrScLO6h0LNLKpilHdlhlBAZewj3EVD0ydejCB5HhHBEjuYzY8i4XT60EXk8693W2X+Aa+6riTz5lum2HEjWU6Bi5cX9CgD31d+VuiZQyn6x1BSs0m4xIwsxMmryMOXYBVJEiAOLrlixT8XHmnmaJnjMIRdySfRbXXPPOP+uy/8uP3VvmZlwYWNJlZBKwxC7kAk8bcBXN+u9Rh6l1OXLhBWJgqoHsGsotwFMhFAp9VCXelNjtEDF9HpRbn5O/0KL78n4zWVzplgw55nNljjdifUpNaf5c8z4XTcH5PLSTuuzI6AMCG1sdQai8w+ah1KH5LCRo8dyPEZ/jksdFCi9hf6aCYEebJPws0/Kl0kQlkMtxttda/BE00sUKC7yMqKPSxArrPhj+7trUvKvlydJ16lnIY9muPC3xbjpvYcrch7a3Cs7TtXtPmYj5cYbhtjjlDdpukRR/ZYzq0Cs0criPZ/DLMSGO5gQgGtwx9tSBTl4ieFMrzwMCWsRGZANVZOzXTs0PKrjLxY8uBoZCQDYhlNmBGoIPKsZh5Bw5JPHbZDezHawVpLBT4aEXAvqakmjMk/xncr40eqFP5QsFVmkhd1P7l5FBKs2jO2nckNhy1tz1qQyl0AaETrBbdIW7zuAW2qbcv2jUkkLpJtx1Ywm8jcJELE/VBPEGoFgTubN7O7bA6vtJ8IEnfG4I3C23hWWILLTgh1TKnxVVdiGGzFdzjulx3tq3OpueXpqNGTIcQgkTgElJAUNgdLf2X4jUVLEGZ90SGaRgEWR7d0E73uUAHEVE4M0avI6k2LLEQQY0W92Xbu3Ne+vZ2a1k1r+1lsUp+91JGiol3mQwOWVwp3ngUO3bwN+f01WZoYcUQOzq0rNOUVRorsSEdX7b29de40SMLlZCosO0LDGASzA/DfdYDaNALcK8PC+Zk7g5aN2ZRNGt1AQ3AYMdLDS/PSqxagqaD0Ky4JcmgqTo4V90+JY8fuMrKzFlZQRpyuSSSfTV1XlEWNFRRZVAAHoFVr0xDADgvPIuSeKhycPEy125MKTDlvUNb1XqyPlnoJN/ko/wC9b31efPYnzHy3iDxr7doBPete17WvblVF6hhtP8usl5QxQqAdGHEXtaskwNzG7e/BdIyzRDROSIZ+kkU4r1jYWJhpsxYUhU8Qihb+u3GvU+LjZIAyIUmC6qJFDWPo3VGeoYQyPljMvjX27dfiOu2/C/ooOo4Rn+X8ZfF3bNpuO99m/C9XdCzxu19eCy2R93W93q/qvP5V0v8Ao4P5SfqqeGCDHTw4I1iS99qKFFzzsKiOfiCf5fxP324KVAJsx1AJAtVF6lgtMIBLeUts2Wa9+HZTdDjG7X1Q90iu8i9X/wAqr9N6dI7SSYsLuxuzNGpJJ5kkV5/Kul/0cH8pP1VMMiA5Bxg4M6qHaPmFJteo/wAxwvH+XMyiXds2m473HbfhehMRcxu3uqJZdDOgfWy9y4eJMiRywRyRx/AjIGVdLaAjTSovyrpf9HB/KT9VSx5AknmhUC0O0M19dzDdbb6qrj5EGTH4sDiRLldy8LqbGq8Tw+FN2QC8gOR4qH8q6X/Rwfyk/VT8q6X/AEcH8pP1V6yM/DxXCTyhGI3AEE93hfQVWXOxIUjeSUBZf4ZF23aX0235VN0K1jS/JXdlpWdbXU/DQV4lx4JxaaJJQOTqG99ViljmjWWM7kYXU2I99RQ52JkSGKGQO6gkgA2sDYkG1jr2Vd0aVHVbmsgSDkP035KsWFhQNuhx4o27URVP6BU1Rx5MEskkUbhpISBKo4qSLi9VjyIZYzLG4aMbgWHDumzfRagI0I+EO41k59earJHHKjRyqHjYWZGFwR6Qat/ynpf9HB/KT9VSpl4z+DskB+YBaH9sAXJHsqOPqWDLKIUmUyElQuouRxAJ4moZQ1MVY9wPt3jUs6ibofRm44MHsjUe4VLj9M6dituxsaKJvtKgDfTxq6pVYcAhy5CGM5EcHKpVaUqrCVaZ2G2SI2jIEkZ0LXsARY6Dn66u6VJREgxViSC4WFxpzjKcWdQuIodRHYlzz2roCwGve5+upRPguy+DIcWSIjYJQVV7La1n7L2POr+bFgnFpUDcNeBsDutca8RVqekxKjBXaRytk8Zi6hrkhradtcdkxQbZAcb+i7CcDU7ok8LeqhjZEl8VJ4Ud73sWtY8dD2XqJpsTHZEVnmkhIvJfYuhJIuBrx1qU9Ly7BRKhXXiL2t8J5br8+FuXpuPynF3BhdB9aNDZC32rW4+qs7Jm0QPVXdAXkT6K1lhnzZ+67bGUyQs6MBtbaGXcLbbW05mshh4iYsZUHc7as3AacAByAqWONIkCRjao4Cvddo4wDuNZFcpZCRtFIpVKrStrCxgwsxc/xodsETSb5WV2IkW1iGiI2hj9oGmNh5kGZJLYNFJK73ErqAr9sW3aT7aydK59qLvWkty6d2TNT+O1Y7Gxs7GkMKLE+M0rS+KxIks5LEFbatc6G9Qt0vKMzOXDQtleO0F7AqLbW3bb7gRe3A1l6U7UWArSyd2Tk0c3WMXDy06hJOoBikkD6SulhtCndGF2tw51crjyjqT5RI8JoVjA+tuVmb6NauqVRjA/63e6hmT/AM7fZYmPp2es65hkQzmUySR202N3Cok46IBbTjSTpmU0zuXDQvkrM2PeysgC2O7bcMCt7cDWWpU7MOd3vqr3pO9LNbRY6TDy/wDPeEyq2WyCNiT3V2qjk6cRravWBgz4c8g3rJjyKp0Gwq6DZoo0sVAq/pV7cXEquOfG/wDtTuSYijH8fCsMmDNGcMrFWNwYTERIxWx3br91Terd+lZCY+HFEwdsZnZyGaG+8N8DICVF2+isvSocUS7vX5/CoyyDM1Pj8qLHWRYEWUWkAsRuMnD9tgCasMPDz8aRigSKFUYLjiRnjZzqpXcv7seqspStGAO2/SsiZG6g6lisPpuZizwzGVZCQy5IttvvPiFg31rPwvyqXBx82BDjSrH4BMh8RWJfvsWHdK259tZClZjijFmcNz4/C0csi7tX9flYvCwcyOTFGQYxFhIyRshJaTcAoJBHd0H014Tp2c0aYsnhLjpOZzICWkPfMgCiwCn03rL0p2o8/wBfCd2TvT9fKpVaUrouaUpSiJSlKIlKUoiUpSiJSlKIlKUoiUpSiJSlKIlKUoiUpSiJSlKIlKUoiUpSiJSlKIlKUoiUpSiJSlKIv//Z',
                  width: 40
              }
            ]
          },
          footer: function(currentPage, pageCount) { 
            //return 'Página ' + currentPage.toString() + ' de ' + pageCount; 
            return {
              margin: [30, 20, 30, 0],
              columns: [
                  {
                      text:'SIRH-2019',
                      alignment:'left',
                      fontSize: 8,
                  },
                  {
                      margin: [10, 0, 0, 0],
                      text: 'Página ' + currentPage.toString() + ' de ' + pageCount,
                      fontSize: 8,
                      alignment: 'center'
                  },
                  {
                    text:fecha_hoy.toString(),
                    alignment:'right',
                    fontSize: 8,
                }
              ]
            }
          },
          content: [
            /*layout: {
                  paddingTop: function(i, node) { return 0; },
                  paddingBottom: function(i, node) { return 0; },
                  paddingLeft: function(i, node) { return 0; },
                  paddingRight: function(i, node) { return 0; },
                  hLineWidth: function(i, node) {
                      if (i < 3) { return 0; } else {
                          return 0.25
                      }
                      return (i === 0 || i === node.table.body.length) ? 0.5 : 0.5;
                  },
                  vLineWidth: function(i, node) {
                      if (i == 0) {
                          contadorLineasHorizontalesV += 1
                      }
                      if (contadorLineasHorizontalesV > 5) {
                          return 0.5
                      } else {
                          return 0
                      }
                  },
              }
              
            }*/
            ],
            styles: {
              cabecera: {
                fontSize: 5,
                bold: true,
                fillColor:"#890000",
                color: "white",
                alignment:"center"
              },
              subcabecera:{
                fontSize: 5,
                bold:true,
                fillColor:"#DEDEDE",
                alignment:"center"
              },
              datos:
              {
                fontSize: 10
              },
              tabla_datos:
              {
                fontSize: 5
              }
            }
        };
        console.log(datos);
      
        //console.log(datos.content[0].table.body);
        //console.log(data);
        let clues = '';
        let cr = '';
        let indice_actual;//(datos.content.length -1);

        //console.log('for(let i = 0; i < ; i++){');
        for(let i = 0; i < reportData.items.length; i++){
          let empleado = reportData.items[i];

          if(cr != empleado.cr_id){
            console.log('cambio cr: '+empleado.cr_id);
            cr = empleado.cr_id;
            if(clues != empleado.clues){
              console.log('cambio clues: ' + empleado.clues);
              clues = empleado.clues;
              
              datos.content.push({
                //layout: 'lightHorizontalLines',
                table: {
                  headerRows:2,
                  dontBreakRows: true,
                  keepWithHeaderRows: 1,
                  widths: [ 43, 60, 110, 30,'*', 40, 30, 50, 35, 29,'*', 80,'*' ],
                  margin: [0,0,0,0],
                  body: [
                    [{text: "["+empleado.clues+"] "+empleado.clues_descripcion, colSpan: 13, style: 'cabecera'},{},{},{},{},{},{},{},{},{},{},{},{}],
                    [{text: "RFC", style: 'cabecera'},
                      {text: "CURP", style: 'cabecera'},
                      {text: "NOMBRE", style: 'cabecera'},
                      {text: "CODIGO", style: 'cabecera'},
                      {text: "PROFESIÓN", style: 'cabecera'},
                      {text: "CLUE FÍSICA", style: 'cabecera'},
                      {text: "CR FÍSICO", style: 'cabecera'},
                      {text: "TURNO", style: 'cabecera'},
                      {text: "H / ENTRADA", style: 'cabecera'},
                      {text: "H / SALIDA", style: 'cabecera'},
                      {text: "ÁREA DE SERVICIO", style: 'cabecera'},
                      {text: "FUNCIÓN", style: 'cabecera'},
                      {text: "OBSERVACIONES", style: 'cabecera'}]
                  ]
                }
              });

              indice_actual = datos.content.length -1;
              console.log('nuevo indice: ' + indice_actual);
            }
            datos.content[indice_actual].table.body.push(
              [{text: "["+empleado.cr_id+"] "+empleado.cr_descripcion, colSpan: 13, style: 'subcabecera'},{},{},{},{},{},{},{},{},{},{},{},{}],
            );
          }

          datos.content[indice_actual].table.body.push([  
            { text: empleado.rfc, style: 'tabla_datos' },
            { text: empleado.curp , style: 'tabla_datos'},
            { text: empleado.nombre , style: 'tabla_datos'},
            { text: empleado.codigo_id , style: 'tabla_datos'},
            { text: empleado.profesion , style: 'tabla_datos'},
            { text: empleado.clues , style: 'tabla_datos'},
            { text: empleado.cr_id , style: 'tabla_datos'},
            { text: empleado.turno , style: 'tabla_datos'},
            { text: empleado.hora_entrada , style: 'tabla_datos'},
            { text: empleado.hora_salida , style: 'tabla_datos'},
            { text: empleado.area_servicio , style: 'tabla_datos'},
            { text: empleado.funcion , style: 'tabla_datos'},
            { text: empleado.observaciones , style: 'tabla_datos'}
          ]);
        }
        return datos;
      }
      
          /*for(let i = 0; i< data.rel_usuario_clues_cr.length; i++)
          {
            let clues = data.rel_usuario_clues_cr[i].clues;
            let cr = data.rel_usuario_clues_cr[i].cr;
            
            datos.content.push(
              {
                alignment: 'center',
                columns: [
                  {
                    text: clues.clues+" "+clues.nombre_unidad+"\n"+cr.cr+" "+cr.descripcion+"\n"
                  }
                ]
              }
            );
            
            datos.content.push(
              {
                table: {
                  widths: [ 43, 60, 110, 30,'*', 40, 30, 50, 35, 29,'*', 80,'*' ],
                  margin: [0,0,0,0],
                  body: [
                    [{text: "RFC", style: 'cabecera'},
                      {text: "CURP", style: 'cabecera'},
                      {text: "NOMBRE", style: 'cabecera'},
                      {text: "CODIGO", style: 'cabecera'},
                      {text: "PROFESIÓN", style: 'cabecera'},
                      {text: "CLUE FÍSICA", style: 'cabecera'},
                      {text: "CR FÍSICO", style: 'cabecera'},
                      {text: "TURNO", style: 'cabecera'},
                      {text: "H / ENTRADA", style: 'cabecera'},
                      {text: "H / SALIDA", style: 'cabecera'},
                      {text: "ÁREA DE SERVICIO", style: 'cabecera'},
                      {text: "FUNCIÓN", style: 'cabecera'},
                      {text: "OBSERVACIONES", style: 'cabecera'}]
                  ]
                }
              }
            );
            
            let indice_actual = (datos.content.length -1);
            //datos.content[indice_actual].table.body.push(
      
            if(data.rel_usuario_clues_cr[i].empleados.length == 0)
            {
              datos.content[indice_actual].table.body.push(
                [{text: "Sin empleados Validados", colSpan: 13, style: 'tabla_datos'},{},{},{},{},{},{},{},{},{},{},{},{}]
              );
            }
            for(let j = 0; j< data.rel_usuario_clues_cr[i].empleados.length; j++)
            {
              let empleado = data.rel_usuario_clues_cr[i].empleados[j];
              let profesion = "S/D";
              let turno = "S/D";
              let funcion = "S/D";
      
              if(empleado.profesion)
                profesion = empleado.profesion.descripcion;
              
              if(empleado.turno)
                turno = empleado.turno.descripcion;  
      
              if(empleado.codigo)
                if(empleado.codigo.grupo_funcion)
                  funcion = empleado.codigo.grupo_funcion.grupo;  

              datos.content[indice_actual].table.body.push(
                [
                    { text: empleado.rfc, style: 'tabla_datos' },
                    { text: empleado.curp , style: 'tabla_datos'},
                    { text: empleado.nombre , style: 'tabla_datos'},
                    { text: empleado.codigo_id , style: 'tabla_datos'},
                    { text: profesion , style: 'tabla_datos'},
                    { text: empleado.clues , style: 'tabla_datos'},
                    { text: empleado.cr_id , style: 'tabla_datos'},
                    { text: turno , style: 'tabla_datos'},
                    { text: empleado.hora_entrada , style: 'tabla_datos'},
                    { text: empleado.hora_salida , style: 'tabla_datos'},
                    { text: empleado.area_servicio , style: 'tabla_datos'},
                    { text: funcion , style: 'tabla_datos'},
                    { text: empleado.observaciones , style: 'tabla_datos'}
                ]
              );
            }
        }*/
        //return datos;
    //}
}