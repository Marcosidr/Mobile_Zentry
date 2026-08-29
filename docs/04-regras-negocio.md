# Regras de Negocio

| Codigo | Regra |
| --- | --- |
| RN01 | O primeiro usuario cadastrado pela API recebe perfil ADMIN. |
| RN02 | Usuarios comuns nao podem criar, editar ou excluir produtos. |
| RN03 | Apenas ADMIN pode alterar perfis e excluir usuarios. |
| RN04 | Nao e permitido excluir o ultimo administrador. |
| RN05 | Produto precisa ter nome, codigo unico, preco, quantidade e categoria. |
| RN06 | Uma saida de estoque nao pode ser maior que o saldo atual. |
| RN07 | Produto com quantidade menor ou igual ao estoque minimo fica com status LOW. |
| RN08 | Upload de produto aceita somente JPG, JPEG, PNG e WEBP. |
| RN09 | Imagens maiores que 5 MB sao rejeitadas. |
| RN10 | O nome do arquivo de upload usa UUID e timestamp para evitar colisao. |

