-- Vista pública de promociones vigentes para el apartado de promociones de la
-- landing. Solo devuelve las publicadas cuya fecha de vigencia incluye "ahora",
-- con la etiqueta legible de aquello a lo que se aplican (producto, categoría o
-- colección). Al ser una vista, la landing la lee con la clave anónima igual que
-- public_products_view, sin necesidad de una política por tabla.

create or replace view public.public_promotions_view as
select
  pr.id,
  pr.name,
  pr.percentage,
  pr.scope,
  pr.starts_at,
  pr.ends_at,
  case pr.scope
    when 'product' then (
      select p.name
      from public.promotion_products pp
      join public.products p on p.id = pp.product_id
      where pp.promotion_id = pr.id
      limit 1
    )
    when 'category' then (
      select c.name
      from public.promotion_categories pc
      join public.categories c on c.id = pc.category_id
      where pc.promotion_id = pr.id
      limit 1
    )
    when 'collection' then (
      select col.name
      from public.promotion_collections pcl
      join public.collections col on col.id = pcl.collection_id
      where pcl.promotion_id = pr.id
      limit 1
    )
  end as target_label
from public.promotions pr
where pr.status = 'published'
  and now() between pr.starts_at and pr.ends_at
order by pr.percentage desc, pr.ends_at;

grant select on public.public_promotions_view to anon, authenticated;
