# Chuva ao Vivo

Player web vertical 9:16 com chuva sobre a cidade à noite. Abra a URL do site, toque em **Iniciar com som** e, se quiser, use **Tela cheia**. Toque no vídeo ou mova o mouse sobre ele para exibir os controles. O navegador pode manter a tela ligada enquanto a página estiver visível e o vídeo estiver rodando, se o aparelho der suporte a esse recurso.

## Publicação na Vercel

Importe este repositório pela opção **Add New → Project**, com `main` como branch de produção e a raiz do repositório como **Root Directory**. O `vercel.json` configura a publicação estática. A rota inicial serve `index.html` e carrega `chuva-suave.mp4` e `chuva-telhado.m4a` do próprio site.

O clipe padrão acompanha o site. **Trocar vídeo** abre um arquivo local para a sessão atual. Se for necessário salvar envios de forma permanente, use Supabase Storage nessa etapa.

O vídeo de aproximadamente 31 segundos toca mudo, com uma transição gradual na volta. A faixa de chuva no telhado dura 39 minutos e 4 segundos e repete no próprio ritmo.
