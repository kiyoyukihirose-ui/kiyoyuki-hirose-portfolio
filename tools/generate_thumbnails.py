from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "images"
OUTPUT = SOURCE / "thumbs"


PROJECTS = {
    "apple-gift": "apple-gift-lp-pc.png",
    "aria-recruit": "aria-recruit-en.png",
    "abies-careers": "abies-careers-top-pc.png",
    "factoring": "aria-factoring-sp.png",
    "apple-ranking": "apple-ranking-pc.png",
    "apple-speed": "apple-speed-sp.png",
}


def crop_at(image: Image.Image, ratio: tuple[int, int], position: float) -> Image.Image:
    target_ratio = ratio[0] / ratio[1]
    source_ratio = image.width / image.height
    if source_ratio > target_ratio:
        crop_width = round(image.height * target_ratio)
        left = round((image.width - crop_width) / 2)
        box = (left, 0, left + crop_width, image.height)
    else:
        crop_height = round(image.width / target_ratio)
        top = round((image.height - crop_height) * position)
        top = max(0, min(top, image.height - crop_height))
        box = (0, top, image.width, top + crop_height)
    return image.crop(box)


def save_webp(image: Image.Image, path: Path, width: int) -> None:
    if image.width > width:
        height = round(image.height * width / image.width)
        image = image.resize((width, height), Image.Resampling.LANCZOS)
    image.save(path, "WEBP", quality=82, method=6)


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    positions = {"top": 0.0, "middle": 0.34, "lower": 0.67}
    for slug, filename in PROJECTS.items():
        with Image.open(SOURCE / filename) as source:
            image = source.convert("RGB")
            portrait_source = image.height / image.width > 3
            ratio = (4, 5) if portrait_source else (16, 10)
            width = 900 if portrait_source else 1440
            for label, position in positions.items():
                crop = crop_at(image, ratio, position)
                save_webp(crop, OUTPUT / f"{slug}-{label}.webp", width)

    banner_sources = {
        "banner-law": "law-office-banner.png",
        "banner-aria": "aria-hiring-square.png",
        "banner-accounting": "abies-accounting-recruit.png",
        "banner-consult": "m2o-consult-square.png",
    }
    for slug, filename in banner_sources.items():
        with Image.open(SOURCE / filename) as source:
            image = crop_at(source.convert("RGB"), (1, 1), 0.0)
            save_webp(image, OUTPUT / f"{slug}.webp", 900)


if __name__ == "__main__":
    main()
