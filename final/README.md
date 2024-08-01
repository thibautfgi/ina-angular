# projet libav

J'ai utilise libav-5.4.6.1.1-webcodecs.js ET libavjs-webcodecs-bridge.js suite a de nombreux test c'est la version ou j'ai eus le moins de bug. J'utilise libav pour fetch, demuxe, read et webcodec pour config, process et decode, bridge pour recupere les metadata indispensable au mp4.


# Testing

```npm install```

```npm install @libav.js/variant-webcodecs```

```npm install libavjs-webcodecs-bridge```

```npm install bootstrap```

```npm install @popperjs/core```

modifier le nom de vidéo voulu dans app/service/libav-init-service, en haut du fichier

```ng serve```


# TIMER 

2h de video process en 18s/20s (512x385) (mp4) ==

Temps de Fetch: 7.0419921875 ms
Demux: 143.739013671875 ms
Reading frames: 16081.988037109375 ms
Config: 5.3671875 ms
Process Frames & Draw: 623.948974609375 ms

 => FINAL TIME <= : 18244.184814453125 ms

 # ATTENTION

 On ne peux pas utiliser libav via @node_module, car angular ne trouve pas le script dus au difference de type, il faut copier le contenue du script voulu et le placer dans notre dossier utilisable, par exemple assets/, normalement, cela ce fais automatiquement si vous avez fait les bonnes installations npm.

 # TODO / ERROR / REMARQUE

- Il y a une erreur sur la première frame process sur les grosses vidéos, voir log.
- timestamp compliquer a recuperé, grosse modification du code.
- J'ai opté plutot que de prendre toute les frames selected, de les decodes et de les envoye a storyboard component pour qu'il les draws a un decodage frame par frame, et envoye frame par frame sur le draw, car quand j'envoyais plus de 14 frames d'un coup au draw, sa plantais.
- J'utilisais de base libav.js variant vp9 webm, mais suite a de nombreux bug je suis passer sur libav webconect et libav webconect bridge, depuis meilleur process.
-surveiller les versions des codecs, si la vidéo indique qu'elle na pas trouver de keyframes pour draw, c'est souvent lier a un pb de codec.