"""Model package wiring.

Importing this package loads all model modules so they can be discovered
consistently by application startup code.
"""

from . import book
from . import lending
from . import lending_cart_item
from . import order
from . import purchase_cart_item
from . import user

__all__ = [
	"book",
	"lending",
	"lending_cart_item",
	"order",
	"purchase_cart_item",
	"user",
]
